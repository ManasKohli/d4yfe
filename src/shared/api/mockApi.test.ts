import { assignments } from '@/data/demo';
import {
  ApiError, completeReview, createMaterial, deleteMaterial, getAdminContent, getLibrary, getMaterialLink, getModuleContent, orphanedPaths,
  requestFeedbackUploadUrl, requestMaterialUploadUrl, requestSubmissionUploadUrl, resetMockApi, submitAssignment, updateLesson,
  updateMaterial, uploadToSignedUrl,
} from '@/shared/api/mockApi';
import type { UploadTarget } from '@/types';

const fileOf = (name: string, type: string, size = 2_000) => {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

const requestFor = {
  materials: (owner: string, name: string) => requestMaterialUploadUrl(owner, name),
  feedback: (owner: string, name: string) => requestFeedbackUploadUrl(owner, name),
  submissions: (owner: string, name: string) => requestSubmissionUploadUrl(owner, name),
} satisfies Record<string, (owner: string, name: string) => Promise<UploadTarget>>;

/** `owner` is the module slug, review id or assignment id the upload URL is requested for. */
async function upload(bucket: keyof typeof requestFor, owner: string, file: File) {
  const progress: number[] = [];
  const target = await requestFor[bucket](owner, file.name);
  const uploaded = await uploadToSignedUrl(target, file, percent => progress.push(percent));
  return { uploaded, progress };
}

const errorCode = async (promise: Promise<unknown>) => {
  try {
    await promise;
    return null;
  } catch (caught) {
    return caught instanceof ApiError ? caught.code : 'unknown';
  }
};

beforeEach(() => resetMockApi());

describe('student content (plan D31, D37)', () => {
  it('derives lesson codes from position: N.0 welcome, N.C for one lesson, N.Ca… for several', async () => {
    const content = await getModuleContent('casper');
    expect(content.welcome.map(lesson => lesson.code)).toEqual(['3.0']);
    expect(content.chapters[0]!.lessons.map(lesson => lesson.code)).toEqual(['3.1']);
    expect(content.chapters[4]!.lessons.map(lesson => lesson.code)).toEqual(['3.5a', '3.5b', '3.5c', '3.5d', '3.5e']);
  });

  it('refuses a module the student is not enrolled in', async () => {
    expect(await errorCode(getModuleContent('application-entries'))).toBe('not-enrolled');
    expect(await errorCode(getModuleContent('no-such-module'))).toBe('not-found');
  });

  it('hides drafts and unrecorded lessons from students but shows them to admins', async () => {
    const student = await getModuleContent('applicant-strategy');
    const admin = await getAdminContent('applicant-strategy');
    const titles = (content: typeof student) => content.chapters.flatMap(chapter => chapter.lessons.map(lesson => lesson.title));
    expect(titles(student)).not.toContain('Mistakes to avoid');
    expect(titles(admin)).toContain('Mistakes to avoid');

    const dat = await getAdminContent('dat');
    const unrecorded = dat.chapters.flatMap(chapter => chapter.lessons).find(lesson => lesson.title === 'Reviewing full-lengths');
    expect(unrecorded).toMatchObject({ videoRef: null, published: false });
  });

  it('keeps a lesson draft until it has a video link', async () => {
    const dat = await getAdminContent('dat');
    const unrecorded = dat.chapters.flatMap(chapter => chapter.lessons).find(lesson => !lesson.videoRef)!;
    expect(await errorCode(updateLesson(unrecorded.id, { published: true }))).toBe('invalid');
    await updateLesson(unrecorded.id, { videoLink: 'https://vimeo.com/123456789', published: true });
    const after = (await getModuleContent('dat')).chapters.flatMap(chapter => chapter.lessons);
    expect(after.some(lesson => lesson.id === unrecorded.id)).toBe(true);
  });
});

describe('library (plan D27, D34, D39)', () => {
  it('shows published library items from enrolled modules plus Start here', async () => {
    const library = await getLibrary();
    const titles = library.map(item => item.title);
    expect(titles).toContain('Partner discount codes for DAT and CASPer prep');
    expect(titles).toContain('Brainstorm workbook');
    expect(library.every(item => item.published && item.libraryCategory)).toBe(true);
    expect(library.some(item => item.moduleSlug === 'application-entries')).toBe(false);
  });
});

describe('signed-URL uploads (plan D28, D30, O4)', () => {
  it('reports progress to 100 and returns the confirmed file', async () => {
    const { uploaded, progress } = await upload('materials', 'dat', fileOf('plan.pdf', 'application/pdf'));
    expect(progress.at(-1)).toBe(100);
    expect(uploaded.path).toMatch(/^dat\/upload-\d+\/plan\.pdf$/);
  });

  it('fails a file that is too large or the wrong type, like the bucket does', async () => {
    expect(await errorCode(upload('submissions', 'a1', fileOf('big.pdf', 'application/pdf', 11 * 1024 * 1024)))).toBe('too-large');
    expect(await errorCode(upload('submissions', 'a1', fileOf('answer.mp4', 'video/mp4')))).toBe('wrong-type');
  });

  it('only issues a feedback upload URL for a review in the queue', async () => {
    expect(await errorCode(requestFeedbackUploadUrl('not-a-review', 'notes.docx'))).toBe('forbidden');
  });

  it('confirms only an upload under the caller’s own prefix', async () => {
    const { uploaded } = await upload('feedback', 'q1', fileOf('notes.pdf', 'application/pdf'));
    expect(await errorCode(completeReview('q2', { feedbackFilePath: uploaded.path }))).toBe('invalid');
    await expect(completeReview('q1', { feedbackFilePath: uploaded.path })).resolves.toBeUndefined();
    expect(await errorCode(completeReview('q1', { feedbackFilePath: uploaded.path }))).toBe('invalid');
  });

  it('adds an uploaded material that students see once published, and logs the replaced file', async () => {
    const { uploaded } = await upload('materials', 'casper', fileOf('drill.pdf', 'application/pdf'));
    await createMaterial('casper', 'the-format', { title: 'Timing drill', kind: 'pdf', track: 'Both', libraryCategory: null, published: false, file: uploaded });
    const draft = (await getAdminContent('casper')).chapters[1]!.materials.find(item => item.title === 'Timing drill')!;
    expect((await getModuleContent('casper')).chapters[1]!.materials.some(item => item.id === draft.id)).toBe(false);

    await updateMaterial(draft.id, { published: true });
    expect((await getModuleContent('casper')).chapters[1]!.materials.some(item => item.id === draft.id)).toBe(true);

    const replacement = await upload('materials', 'casper', fileOf('drill-v2.pdf', 'application/pdf'));
    await updateMaterial(draft.id, { file: replacement.uploaded });
    expect(orphanedPaths()).toEqual([`materials/${uploaded.path}`]);
  });
});

describe('submissions (plan D29, D36)', () => {
  const practice = assignments.find(item => item.id === 'a4')!;
  const items = (videoUrl: string) => [
    { kind: 'video_link' as const, label: 'Video 1', videoUrl },
    { kind: 'video_link' as const, label: 'Video 2', videoUrl: 'https://youtu.be/abc123' },
    { kind: 'text' as const, label: 'Typed answer 1', body: 'One' },
    { kind: 'text' as const, label: 'Typed answer 2', body: 'Two' },
    { kind: 'text' as const, label: 'Typed answer 3', body: 'Three' },
  ];

  it('accepts video links and typed answers that match the assignment, once', async () => {
    await expect(submitAssignment(practice.id, items('https://www.loom.com/share/abc'), '')).resolves.toBeUndefined();
    expect(await errorCode(submitAssignment(practice.id, items('https://www.loom.com/share/abc'), ''))).toBe('invalid');
  });

  it('rejects a link from another host, answers that don’t match the spec, or a closed assignment', async () => {
    expect(await errorCode(submitAssignment(practice.id, items('https://dropbox.com/s/abc'), ''))).toBe('invalid');
    expect(await errorCode(submitAssignment(practice.id, items('https://youtu.be/abc').slice(0, 2), ''))).toBe('invalid');
    expect(await errorCode(submitAssignment('a3', [{ kind: 'file', label: 'Your file' }], ''))).toBe('invalid');
  });
});

describe('review fixes', () => {
  it('refuses a draft material or one from a module outside the package', async () => {
    const draft = (await getAdminContent('casper')).chapters.flatMap(chapter => chapter.materials).find(item => !item.published)!;
    expect(await errorCode(getMaterialLink(draft.id))).toBe('not-found');
    const locked = (await getAdminContent('application-entries')).chapters.flatMap(chapter => chapter.materials)[0]!;
    expect(await errorCode(getMaterialLink(locked.id))).toBe('not-enrolled');
  });

  it('only accepts same-site portal paths for links', async () => {
    const link = (value: string) => createMaterial('casper', null, { title: 'Hub', kind: 'link', track: 'Both', libraryCategory: null, published: false, link: value });
    expect(await errorCode(link('//other-host.example/x'))).toBe('invalid');
    expect(await errorCode(link('/\\other-host.example/x'))).toBe('invalid');
    await expect(link('/portal/schools')).resolves.toBeUndefined();
  });

  it('logs the old file when a file material becomes a link', async () => {
    const pdf = (await getAdminContent('casper')).chapters.flatMap(chapter => chapter.materials).find(item => item.fileName)!;
    await updateMaterial(pdf.id, { kind: 'link', link: 'https://example.org/x' });
    expect(orphanedPaths()).toHaveLength(1);
  });

  it('won’t attach one upload to two materials', async () => {
    const { uploaded } = await upload('materials', 'casper', fileOf('card.pdf', 'application/pdf'));
    const add = () => createMaterial('casper', null, { title: 'Card', kind: 'pdf', track: 'Both', libraryCategory: null, published: false, file: uploaded });
    await add();
    expect(await errorCode(add())).toBe('invalid');
  });

  it('refuses a chapter outside the module and a delete of an unknown id', async () => {
    expect(await errorCode(createMaterial('casper', 'not-a-chapter', { title: 'X', kind: 'link', track: 'Both', libraryCategory: null, published: false, link: 'https://example.org' }))).toBe('not-found');
    expect(await errorCode(deleteMaterial('no-such-material'))).toBe('not-found');
  });
});
