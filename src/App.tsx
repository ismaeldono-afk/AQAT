import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';

type Rating = 0 | 1 | 2 | null;
type WorkflowStatus = 'draft' | 'submitted' | 'hos-verified' | 'under-review' | 'approved';
type WorkflowRole = 'lecturer' | 'hos' | 'reviewer';
type UserRole = WorkflowRole | 'administrator';

interface Session {
  name: string;
  role: UserRole;
}

function readStoredPlatformSettings(): PlatformSettings {
  const defaults: PlatformSettings = {
    platformName: DEFAULT_PLATFORM_NAME,
    institutionName: 'Papua New Guinea University of Technology',
    supportEmail: '',
    resultPrefix: 'aqat',
  };
  try {
    const stored = window.localStorage.getItem(PLATFORM_SETTINGS_KEY);
    if (!stored) return defaults;
    const settings = JSON.parse(stored) as Partial<PlatformSettings>;
    return {
      platformName: typeof settings.platformName === 'string' ? settings.platformName : defaults.platformName,
      institutionName: typeof settings.institutionName === 'string' ? settings.institutionName : defaults.institutionName,
      supportEmail: typeof settings.supportEmail === 'string' ? settings.supportEmail : defaults.supportEmail,
      resultPrefix: typeof settings.resultPrefix === 'string' ? settings.resultPrefix : defaults.resultPrefix,
    };
  } catch {
    return defaults;
  }
}

interface Evidence {
  name: string;
  size: number;
  addedAt: string;
}

interface TeachingAllocation {
  id: string;
  school: string;
  campus: string;
  semester: '1' | '2';
  year: string;
  submittedBy: string;
  files: Evidence[];
  submittedAt: string;
}

interface SubmissionSettings {
  isOpen: boolean;
  dueDate: string;
}

interface PlatformSettings {
  platformName: string;
  institutionName: string;
  supportEmail: string;
  resultPrefix: string;
}

interface SummaryReportEntry {
  number: number;
  staff: string;
  subjectTitle: string;
  subjectCode: string;
  level: string;
  subjectFileRequired: string;
  assessmentComment: string;
  rate: number;
  submissionDate: string;
}

interface ChecklistEntry {
  id: string;
  section: number;
  title: string;
  guidance: string;
  rating: Rating;
  comment: string;
  evidence: Evidence[];
}

interface Verification {
  staffNames: string;
  semester: '1' | '2';
  year: string;
  submitted: boolean | null;
  hosPresent: boolean | null;
  hosSigned: boolean | null;
  school: string;
  subject: string;
  subjectCode: string;
  hosName: string;
  chairName: string;
  chairApproval: boolean | null;
  status: WorkflowStatus;
  updatedAt: string;
  checklist: ChecklistEntry[];
}

const STORAGE_KEY = 'aqat-subject-verification-v1';
const SESSION_KEY = 'aqat-user-session-v1';
const ALLOCATION_STORAGE_KEY = 'aqat-teaching-allocations-v1';
const SUBMISSION_SETTINGS_KEY = 'aqat-submission-settings-v1';
const PLATFORM_SETTINGS_KEY = 'aqat-platform-settings-v1';
const MAX_SCORE = 24;
const DEFAULT_PLATFORM_NAME = 'Academic Quality, Assurance of Teaching';
const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}assets/${filename}`;
const AGRICULTURE_SUMMARY_COMMENT = 'Fully submitted neatly stacked on GD/CD';
const AGRICULTURE_SUMMARY_REPORT: SummaryReportEntry[] = [
  { number: 1, staff: 'Prof. R Rao', subjectTitle: 'Soil Fertility Management', subjectCode: 'AG 213', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 2, staff: 'Dr. Jaya Prakash', subjectTitle: 'Physiology and Anatomy of Animals', subjectCode: 'AG114', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 3, staff: 'Dr. Jaya Prakash', subjectTitle: 'Animal Health and Diseases', subjectCode: 'AG313', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 4, staff: 'Dr. S. Poloma', subjectTitle: 'Agronomy I', subjectCode: 'AG211', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 5, staff: 'Prof. Danbaro', subjectTitle: 'Animal Breeding', subjectCode: 'AG412', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 6, staff: 'Dr. Bue, Ms. Parau', subjectTitle: 'Agricultural Extension', subjectCode: 'AG414', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 7, staff: 'Mrs. Maino & Ms. Parau', subjectTitle: 'Professional Practice & Communication', subjectCode: 'AG113', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 8, staff: 'Professor Tom Okpul, Dr. Victor Eze', subjectTitle: 'Research Methods 1', subjectCode: 'AG312', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 9, staff: 'Dr. Ban', subjectTitle: 'Crop Diseases', subjectCode: 'AG314', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 10, staff: 'Dr. Ban, Prof. Rao', subjectTitle: 'Biochemistry', subjectCode: 'AG111', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 11, staff: 'Dr. Michael', subjectTitle: 'Environment and Sustainability', subjectCode: 'AG411', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 12, staff: 'Dr. Pandi, Mr. Nano', subjectTitle: 'Animal Management', subjectCode: 'AG311', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 13, staff: 'Dr. Eze, Mr. Kiwa', subjectTitle: 'Introduction to Agric. Economics', subjectCode: 'AG112', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
  { number: 14, staff: 'Dr. Dotaona', subjectTitle: 'Agric Entomology', subjectCode: 'AG214', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: AGRICULTURE_SUMMARY_COMMENT, rate: 4, submissionDate: '17/07/2026' },
];
const APPLIED_SCIENCE_SUMMARY_REPORT: (SummaryReportEntry & { department: string })[] = [
  { number: 2, staff: 'A/P Srikanth Bathula', subjectTitle: 'Advance Analytical Chemistry; Research Project', subjectCode: 'CH314; CH411', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Chemistry' },
  { number: 3, staff: 'A/Prof Janarthanan Gopalakrishnan', subjectTitle: 'Petroleum Chemistry; Research Project', subjectCode: 'CH413; CH411', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Chemistry' },
  { number: 4, staff: 'Dr. David Timi', subjectTitle: 'Chemistry for Natural Resources; Research Project', subjectCode: 'AS113; CH411', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Fully submitted', rate: 4, submissionDate: '23/04/2026', department: 'Chemistry' },
  { number: 5, staff: 'Mr. Justin Narimbi', subjectTitle: 'Research Project; Industrial Training', subjectCode: 'CH411; CH400', level: 'UG', subjectFileRequired: '—', assessmentComment: '—', rate: 4, submissionDate: '23/04/2026', department: 'Chemistry' },
  { number: 6, staff: 'Mr. Jason Wau', subjectTitle: 'Instrumental Analysis; Applied Organic Chemistry; Research Project', subjectCode: 'CH313; CH213; CH411', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Chemistry' },
  { number: 7, staff: 'Mr. Kaupa Philip', subjectTitle: 'Research Project', subjectCode: 'CH411', level: 'UG', subjectFileRequired: '—', assessmentComment: '—', rate: 4, submissionDate: '23/04/2026', department: 'Chemistry' },
  { number: 8, staff: 'Ms. Salvina Ku', subjectTitle: 'Foundation Chemistry; Foundation Chemistry; Applied Physical Chemistry', subjectCode: 'CH111; AS111; CH211', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Chemistry' },
  { number: 9, staff: 'Ms. Milka Vincent', subjectTitle: 'Geometry / Mineral Tech', subjectCode: 'CH312', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Chemistry' },
  { number: 10, staff: 'Ms. Stephanie Anis', subjectTitle: 'Industrial Organic Chemistry', subjectCode: 'CH412', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Chemistry' },
  { number: 12, staff: 'Mr. Reilly Nigo', subjectTitle: 'Food Engineering II; Innovation and Entrepreneurship', subjectCode: 'FT311; FT414', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Not submitted', rate: 0, submissionDate: '—', department: 'Food Technology' },
  { number: 13, staff: 'Dr. Lydia Yalambing', subjectTitle: 'Nutrition I; Advance Nutrition', subjectCode: 'FT214; FT412', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 0, submissionDate: '—', department: 'Food Technology' },
  { number: 14, staff: 'Dr. Getachew Tolesa', subjectTitle: 'Food Engineering I; Food Chemistry; Food Processing Practical III', subjectCode: 'FT211; FT212; FT413', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Food Technology' },
  { number: 15, staff: 'Dr. Selvakumar Palaniappan', subjectTitle: 'Food Microbiology; Food Microbiology and Biotechnology', subjectCode: 'FT213; FT313', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Food Technology' },
  { number: 16, staff: 'Mrs. Sogoing Denana', subjectTitle: 'Quality Assurance', subjectCode: 'FT312', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Food Technology' },
  { number: 17, staff: 'Mr. Nigel Kiaka', subjectTitle: 'Food Engineering I', subjectCode: 'FT211', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Food Technology' },
  { number: 18, staff: 'Mrs. Rag Gubag Sipou', subjectTitle: 'Food Microbiology; Food Microbiology and Biotechnology', subjectCode: 'FT213; FT313', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Food Technology' },
  { number: 19, staff: 'Ms. Dilkay Bau', subjectTitle: 'Food Chemistry; Quality Assurance', subjectCode: 'FT212; FT312', level: 'UG', subjectFileRequired: 'Yes', assessmentComment: 'Complete', rate: 4, submissionDate: '23/04/2026', department: 'Food Technology' },
];

const CHECKLIST_TEMPLATE: Omit<ChecklistEntry, 'rating' | 'comment' | 'evidence'>[] = [
  {
    id: 'lecture-plan',
    section: 1,
    title: 'Lecture plan',
    guidance: 'Current lecture plan for the subject.',
  },
  {
    id: 'lecture-notes',
    section: 2,
    title: 'Lecture notes',
    guidance: 'Lecture notes and associated delivery materials.',
  },
  {
    id: 'tutorials',
    section: 3,
    title: 'Tutorials (if compulsory only)',
    guidance: 'Tutorial materials, instructions and solutions where tutorials are compulsory.',
  },
  {
    id: 'assignments',
    section: 4,
    title: 'Assignments with solutions and 3 marked copies',
    guidance: 'Assignment questions, solutions and three marked student copies.',
  },
  {
    id: 'laboratory-assignments',
    section: 5,
    title: 'Laboratory assignments with 3 marked copies',
    guidance: 'Laboratory assignments and three marked student copies.',
  },
  {
    id: 'quizzes',
    section: 6,
    title: 'Quizzes with solutions and 3 marked copies',
    guidance: 'Quiz questions, solutions and three marked student copies.',
  },
  {
    id: 'tests',
    section: 7,
    title: 'Tests with solutions and 3 marked copies',
    guidance: 'Test questions, solutions and three marked student copies.',
  },
  {
    id: 'field-visit',
    section: 8,
    title: 'Field visit / industrial training report',
    guidance: 'Field visit or industrial training report where applicable.',
  },
  {
    id: 'student-evaluation',
    section: 9,
    title: 'Student evaluation summary of teachers',
    guidance: 'Summary of student evaluations for the teacher.',
  },
  {
    id: 'final-exam-paper',
    section: 10,
    title: 'Final exam question paper and solutions',
    guidance: 'Final examination question paper and solutions.',
  },
  {
    id: 'exam-moderation',
    section: 11,
    title: 'Copy of final exam moderation sheet',
    guidance: 'Completed final examination moderation sheet.',
  },
  {
    id: 'marked-exam-scripts',
    section: 12,
    title: 'Copies of marked exam scripts',
    guidance: 'Copies of marked final examination scripts.',
  },
];

const emptyVerification = (): Verification => ({
  staffNames: '',
  semester: '1',
  year: String(new Date().getFullYear()),
  submitted: null,
  hosPresent: null,
  hosSigned: null,
  school: '',
  subject: '',
  subjectCode: '',
  hosName: '',
  chairName: '',
  chairApproval: null,
  status: 'draft',
  updatedAt: new Date().toISOString(),
  checklist: CHECKLIST_TEMPLATE.map((item) => ({
    ...item,
    rating: null,
    comment: '',
    evidence: [],
  })),
});

function readStoredVerification(): Verification {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyVerification();
    const parsed = JSON.parse(stored) as Partial<Verification>;
    if (!Array.isArray(parsed.checklist)) return emptyVerification();
    return { ...emptyVerification(), ...parsed };
  } catch {
    return emptyVerification();
  }
}

function readStoredSession(): Session | null {
  try {
    const stored = window.localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored) as Session;
    return session.name && ['lecturer', 'reviewer', 'administrator'].includes(session.role) ? session : null;
  } catch {
    return null;
  }
}

function readStoredAllocations(): TeachingAllocation[] {
  try {
    const stored = window.localStorage.getItem(ALLOCATION_STORAGE_KEY);
    if (!stored) return [];
    const allocations = JSON.parse(stored) as TeachingAllocation[];
    return Array.isArray(allocations) ? allocations : [];
  } catch {
    return [];
  }
}

function readStoredSubmissionSettings(): SubmissionSettings {
  try {
    const stored = window.localStorage.getItem(SUBMISSION_SETTINGS_KEY);
    if (!stored) return { isOpen: true, dueDate: '' };
    const settings = JSON.parse(stored) as Partial<SubmissionSettings>;
    return { isOpen: settings.isOpen !== false, dueDate: typeof settings.dueDate === 'string' ? settings.dueDate : '' };
  } catch {
    return { isOpen: true, dueDate: '' };
  }
}

function isSubmissionWindowOpen(settings: SubmissionSettings) {
  if (!settings.isOpen) return false;
  return !settings.dueDate || new Date(`${settings.dueDate}T23:59:59`).getTime() >= Date.now();
}

function submissionWindowMessage(settings: SubmissionSettings) {
  if (!settings.isOpen) return 'The administrator has closed the submission window.';
  if (settings.dueDate && !isSubmissionWindowOpen(settings)) return `The submission due date (${settings.dueDate}) has passed.`;
  return settings.dueDate ? `Submissions are open until ${settings.dueDate}.` : 'Submissions are currently open.';
}

const statusCopy: Record<WorkflowStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted to HoS',
  'hos-verified': 'HoS verified',
  'under-review': 'AQAT review',
  approved: 'Approved',
};

const ratingCopy: Record<Exclude<Rating, null>, string> = {
  2: 'Complete',
  1: 'Incomplete',
  0: 'Nil',
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-PG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
}

function suggestedResultFilename(verification: Verification, prefix = 'aqat') {
  const subjectPart = (verification.subjectCode || verification.subject || 'subject')
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase();
  const safePrefix = prefix.trim().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '').toLowerCase();
  return `${safePrefix || 'aqat'}-${subjectPart || 'subject'}-${verification.year}-result`;
}

function pdfFilename(value: string, fallback: string) {
  const safeName = value
    .trim()
    .replace(/\.pdf$/i, '')
    .replace(/[^a-z0-9_-]+/gi, '-')
    .replace(/(^-|-$)/g, '');
  return `${safeName || fallback}.pdf`;
}

export default function App() {
  const [verification, setVerification] = useState<Verification>(readStoredVerification);
  const [session, setSession] = useState<Session | null>(readStoredSession);
  const [allocations, setAllocations] = useState<TeachingAllocation[]>(readStoredAllocations);
  const [submissionSettings, setSubmissionSettings] = useState<SubmissionSettings>(readStoredSubmissionSettings);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(readStoredPlatformSettings);
  const [workflowRole, setWorkflowRole] = useState<WorkflowRole>(() => (
    session?.role === 'reviewer' ? 'reviewer' : session?.role === 'hos' ? 'hos' : 'lecturer'
  ));
  const [adminDashboard, setAdminDashboard] = useState(true);
  const [activeArea, setActiveArea] = useState<'verification' | 'allocations'>('verification');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [platformSearch, setPlatformSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [resultFileName, setResultFileName] = useState('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(verification));
  }, [verification]);

  useEffect(() => {
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
  }, [session]);

  useEffect(() => {
    window.localStorage.setItem(ALLOCATION_STORAGE_KEY, JSON.stringify(allocations));
  }, [allocations]);

  useEffect(() => {
    window.localStorage.setItem(SUBMISSION_SETTINGS_KEY, JSON.stringify(submissionSettings));
  }, [submissionSettings]);

  useEffect(() => {
    window.localStorage.setItem(PLATFORM_SETTINGS_KEY, JSON.stringify(platformSettings));
  }, [platformSettings]);

  const platformName = platformSettings.platformName.trim() || DEFAULT_PLATFORM_NAME;
  const score = useMemo(
    () => verification.checklist.reduce((total, item) => total + (item.rating ?? 0), 0),
    [verification.checklist],
  );
  const scaledScore = (score / MAX_SCORE) * 4;
  const ratingSummary = useMemo(() => ({
    complete: verification.checklist.filter((item) => item.rating === 2).length,
    incomplete: verification.checklist.filter((item) => item.rating === 1).length,
    nil: verification.checklist.filter((item) => item.rating === 0).length,
  }), [verification.checklist]);
  const evidenceCount = verification.checklist.reduce((total, item) => total + item.evidence.length, 0);
  const everyRowRated = verification.checklist.every((item) => item.rating !== null);
  const isReadyToSubmit = verification.checklist.every((item) => item.evidence.length > 0);

  function updateDetails(field: keyof Verification, value: string | boolean | null) {
    setVerification((current) => ({ ...current, [field]: value, updatedAt: new Date().toISOString() }));
  }

  function updateEntry(id: string, patch: Partial<ChecklistEntry>) {
    setVerification((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      checklist: current.checklist.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    }));
  }

  function uploadEvidence(id: string, event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const evidence = files.map((file) => ({ name: file.name, size: file.size, addedAt: new Date().toISOString() }));
    const entry = verification.checklist.find((item) => item.id === id);
    if (entry) updateEntry(id, { evidence: [...entry.evidence, ...evidence] });
    event.target.value = '';
  }

  function removeEvidence(id: string, index: number) {
    const entry = verification.checklist.find((item) => item.id === id);
    if (!entry) return;
    updateEntry(id, { evidence: entry.evidence.filter((_, evidenceIndex) => evidenceIndex !== index) });
  }

  function submitToHos() {
    if (!isSubmissionWindowOpen(submissionSettings)) {
      setNotice(submissionWindowMessage(submissionSettings));
      return;
    }
    if (!isReadyToSubmit) {
      setNotice('Attach at least one evidence file to every verification row before submitting to the Head of School.');
      return;
    }
    setVerification((current) => ({
      ...current,
      submitted: true,
      status: 'submitted',
      updatedAt: new Date().toISOString(),
    }));
    setNotice('The sheet has been submitted for Head of School verification.');
  }

  function verifyHos() {
    const hosName = verification.hosName.trim() || (session?.role === 'hos' ? session.name : '');
    if (!hosName || verification.hosPresent !== true || verification.hosSigned !== true) {
      setNotice('Enter the Head of School name and confirm both presence and signature before forwarding to AQAT.');
      return;
    }
    setVerification((current) => ({
      ...current,
      hosName,
      status: 'hos-verified',
      updatedAt: new Date().toISOString(),
    }));
    setNotice('Head of School verification is recorded and ready for AQAT review.');
  }

  function beginReview() {
    setVerification((current) => ({ ...current, status: 'under-review', updatedAt: new Date().toISOString() }));
    setNotice('AQAT reviewer assessment is now active.');
  }

  function approve() {
    if (!verification.chairName.trim() || verification.chairApproval !== true || !everyRowRated) {
      setNotice('Rate all 12 verification rows, enter the AQAT Chairperson name, and record approval before finalising.');
      return;
    }
    setVerification((current) => ({ ...current, status: 'approved', updatedAt: new Date().toISOString() }));
    setNotice('AQAT Chairperson approval has been recorded.');
  }

  function rateAll(rating: Exclude<Rating, null>) {
    const ratingLabel = ratingCopy[rating];
    if (!window.confirm(`Set every one of the 12 checklist ratings to ${ratingLabel} (${rating})? You can still adjust individual ratings afterwards.`)) return;
    setVerification((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      checklist: current.checklist.map((entry) => ({ ...entry, rating })),
    }));
    setNotice(`All 12 checklist rows are now rated ${ratingLabel} (${rating}). Total marks: ${rating * 12} / ${MAX_SCORE}.`);
  }

  function resetSheet() {
    if (window.confirm('Start a new subject verification sheet? This clears the saved workflow on this browser.')) {
      const fresh = emptyVerification();
      setVerification(fresh);
      setNotice('A fresh subject verification sheet is ready.');
    }
  }

  async function downloadResult() {
    setIsDownloading(true);
    try {
    const filename = pdfFilename(resultFileName, suggestedResultFilename(verification, platformSettings.resultPrefix));
    const crest = await getImageData(assetUrl('png-unitech-result-crest.jpg'));
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = 46;

    function drawHeader() {
      pdf.setFillColor(116, 24, 60);
      pdf.rect(0, 0, pageWidth, 22, 'F');
      pdf.addImage(crest, 'JPEG', 42, 34, 48, 62);
      pdf.setTextColor(116, 24, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text((platformSettings.institutionName || 'Papua New Guinea University of Technology').toUpperCase(), 103, 50);
      pdf.setFont('times', 'bold');
      pdf.setFontSize(15);
      pdf.text(platformName, 103, 73);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(91, 68, 79);
      pdf.text(`Result generated ${formatDate(new Date().toISOString())}`, 103, 88);
      y = 122;
    }

    function newPageIfNeeded(height: number) {
      if (y + height < pageHeight - 44) return;
      pdf.addPage();
      drawHeader();
    }

    function addText(text: string, x: number, width: number, lineHeight = 12) {
      const lines = pdf.splitTextToSize(text, width);
      newPageIfNeeded(lines.length * lineHeight + 8);
      pdf.text(lines, x, y);
      y += lines.length * lineHeight;
    }

    drawHeader();
    pdf.setFillColor(250, 242, 223);
    pdf.roundedRect(42, y, pageWidth - 84, 52, 4, 4, 'F');
    pdf.setTextColor(116, 24, 60);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('TOTAL MARKS', 58, y + 18);
    pdf.setFont('times', 'bold');
    pdf.setFontSize(21);
    pdf.text(`${score} / ${MAX_SCORE}`, 58, y + 41);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text(`${scaledScore.toFixed(2)} / 4`, 180, y + 40);
    pdf.setFontSize(8);
    pdf.setTextColor(91, 68, 79);
    pdf.text(`Complete: ${ratingSummary.complete}  |  Incomplete: ${ratingSummary.incomplete}  |  Nil: ${ratingSummary.nil}`, 300, y + 40);
    y += 76;

    pdf.setTextColor(116, 24, 60);
    pdf.setFont('times', 'bold');
    pdf.setFontSize(13);
    pdf.text('Subject and verification details', 42, y);
    y += 18;
    pdf.setTextColor(53, 30, 40);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    [
      ['Staff name(s)', verification.staffNames || 'Not recorded'],
      ['School', verification.school || 'Not recorded'],
      ['Subject', verification.subject || 'Not recorded'],
      ['Subject code', verification.subjectCode || 'Not recorded'],
      ['Semester / year', `Semester ${verification.semester}, ${verification.year}`],
      ['Workflow status', statusCopy[verification.status]],
      ['Lecturer submitted', formatBoolean(verification.submitted)],
      ['HoS present / signed', `${formatBoolean(verification.hosPresent)} / ${formatBoolean(verification.hosSigned)}`],
      ['Head of School', verification.hosName || 'Not recorded'],
    ].forEach(([label, value]) => {
      newPageIfNeeded(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${label}:`, 42, y);
      pdf.setFont('helvetica', 'normal');
      addText(value, 168, pageWidth - 210);
      y += 6;
    });

    newPageIfNeeded(42);
    pdf.setTextColor(116, 24, 60);
    pdf.setFont('times', 'bold');
    pdf.setFontSize(13);
    pdf.text('Checklist assessment', 42, y);
    y += 18;
    verification.checklist.forEach((entry) => {
      newPageIfNeeded(74);
      pdf.setFillColor(250, 247, 246);
      pdf.roundedRect(42, y - 11, pageWidth - 84, 24, 3, 3, 'F');
      pdf.setTextColor(116, 24, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(`${entry.section}. ${entry.title}`, 50, y + 4);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(53, 30, 40);
      pdf.text(entry.rating === null ? 'Not rated' : `${ratingCopy[entry.rating]} (${entry.rating})`, pageWidth - 115, y + 4);
      y += 29;
      pdf.setFontSize(8);
      if (entry.comment) addText(`Reviewer comment: ${entry.comment}`, 50, pageWidth - 100, 10);
      addText(`Evidence: ${entry.evidence.length ? entry.evidence.map((file) => file.name).join(', ') : 'No evidence recorded'}`, 50, pageWidth - 100, 10);
      y += 8;
    });

    newPageIfNeeded(76);
    pdf.setDrawColor(214, 156, 32);
    pdf.rect(42, y, pageWidth - 84, 58);
    pdf.setTextColor(116, 24, 60);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('AQAT Chairperson approval', 54, y + 18);
    pdf.setTextColor(53, 30, 40);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Chairperson: ${verification.chairName || 'Not recorded'}`, 54, y + 34);
    pdf.text(`Approval recorded: ${formatBoolean(verification.chairApproval)}`, 54, y + 48);
    pdf.save(filename);
    setNotice(`The branded AQAT verification result PDF has been downloaded as ${filename}.`);
    } catch {
      setNotice('The result PDF could not be created. Check the logo asset and try again.');
    } finally {
    setIsDownloading(false);
    }
  }

  function login(name: string, role: UserRole) {
    setSession({ name, role });
    setWorkflowRole(role === 'reviewer' ? 'reviewer' : role === 'hos' ? 'hos' : 'lecturer');
    setAdminDashboard(role === 'administrator');
  }

  function logout() {
    setSession(null);
    setShowTutorial(false);
    setShowSearch(false);
    setNotice('');
  }

  const isAdministrator = session?.role === 'administrator';
  const reviewerMode = session?.role === 'reviewer' || (isAdministrator && workflowRole === 'reviewer');
  const hosMode = session?.role === 'hos' || (isAdministrator && workflowRole === 'hos');
  const lecturerMode = !reviewerMode && !hosMode;
  const canRate = reviewerMode && verification.status === 'under-review';

  if (showTutorial) {
    return <PlatformTutorial signedIn={Boolean(session)} onBack={() => setShowTutorial(false)} />;
  }

  if (!session) return <LoginPage onLogin={login} onShowTutorial={() => setShowTutorial(true)} />;

  if (isAdministrator && adminDashboard) {
    return (
      <AdminDashboard
        verification={verification}
        score={score}
        scaledScore={scaledScore}
        administratorName={session.name}
        downloading={isDownloading}
        resultFileName={resultFileName}
        suggestedFilename={suggestedResultFilename(verification, platformSettings.resultPrefix)}
        onOpenWorkflow={(role) => { setWorkflowRole(role); setAdminDashboard(false); }}
        onOpenAllocations={() => { setActiveArea('allocations'); setAdminDashboard(false); }}
        submissionSettings={submissionSettings}
        onSubmissionSettingsChange={setSubmissionSettings}
        platformSettings={platformSettings}
        onPlatformSettingsChange={setPlatformSettings}
        onDownload={downloadResult}
        onResultFileNameChange={setResultFileName}
        onShowTutorial={() => setShowTutorial(true)}
        onLogout={logout}
      />
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img className="unitech-logo" src={assetUrl('png-unitech-wordmark.jpg')} alt="Papua New Guinea University of Technology" />
          <div>
            <p className="eyebrow">Academic Quality, Assurance of Teaching</p>
            <h1>{platformName}</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <span className={`status-pill status-${verification.status}`}>{statusCopy[verification.status]}</span>
          {isAdministrator ? (
            <>
              <button className="admin-dashboard-link" onClick={() => setAdminDashboard(true)}>Administrator dashboard</button>
              <div className="role-switch" role="group" aria-label="Administrator workflow view">
                <button className={workflowRole === 'lecturer' ? 'active' : ''} onClick={() => setWorkflowRole('lecturer')}>Lecturer view</button>
                <button className={workflowRole === 'hos' ? 'active' : ''} onClick={() => setWorkflowRole('hos')}>HoS view</button>
                <button className={workflowRole === 'reviewer' ? 'active' : ''} onClick={() => setWorkflowRole('reviewer')}>QA review</button>
              </div>
            </>
          ) : <span className="signed-in-as">{session.role === 'reviewer' ? 'QA reviewer' : session.role === 'hos' ? 'Head of School' : 'Lecturer'}: {session.name}</span>}
          <button className="platform-search-button" onClick={() => setShowSearch(true)}><span aria-hidden="true">⌕</span> Search platform</button>
          <button className="tutorial-link" onClick={() => setShowTutorial(true)}>How to use AQAT</button>
          <button className="logout-button" onClick={logout}>Sign out</button>
        </div>
      </header>

      <nav className="workspace-nav" aria-label="AQAT workspaces">
        <button className={activeArea === 'verification' ? 'active' : ''} onClick={() => setActiveArea('verification')}>Subject verification</button>
        <button className={activeArea === 'allocations' ? 'active' : ''} onClick={() => setActiveArea('allocations')}>Teaching allocations</button>
      </nav>

      {activeArea === 'allocations' ? (
        <TeachingAllocationsPage
          allocations={allocations}
          currentUser={session.name}
          canUpload={lecturerMode && isSubmissionWindowOpen(submissionSettings)}
          submissionOpen={isSubmissionWindowOpen(submissionSettings)}
          submissionMessage={submissionWindowMessage(submissionSettings)}
          onAdd={(allocation) => setAllocations((current) => [allocation, ...current])}
        />
      ) : (
        <>
      <section className="hero">
        <div>
          <p className="eyebrow accent">Verification of Subject Files</p>
          <h2>A complete subject evidence and quality review workflow.</h2>
          <p>Save lecturer evidence, record Head of School verification, assess every criterion and secure AQAT Chairperson approval in one durable sheet.</p>
        </div>
        <div className="score-card" aria-label={`Current AQAT score ${score} out of ${MAX_SCORE}, ${scaledScore.toFixed(2)} out of 4`}>
          <span>Current AQAT score</span>
          <strong>{score}<small> / {MAX_SCORE}</small></strong>
          <b>{scaledScore.toFixed(2)}<small> / 4</small></b>
        </div>
      </section>

      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} aria-label="Dismiss notification">×</button>
        </div>
      )}

      <nav className="workflow-steps" aria-label="Workflow progress">
        {[
          ['1', 'Evidence collection', verification.status !== 'draft'],
          ['2', 'HoS verification', ['hos-verified', 'under-review', 'approved'].includes(verification.status)],
          ['3', 'AQAT review', ['under-review', 'approved'].includes(verification.status)],
          ['4', 'Chair approval', verification.status === 'approved'],
        ].map(([number, label, complete], index) => (
          <div className={`step ${complete ? 'complete' : ''}`} key={label as string}>
            <span>{complete ? '✓' : number}</span>
            <p>{label}</p>
            {index < 3 && <i aria-hidden="true" />}
          </div>
        ))}
      </nav>

      <div className="page-grid">
        <section className="primary-content">
          <form className="panel subject-form" onSubmit={(event: FormEvent) => event.preventDefault()}>
            <div className="panel-heading">
              <div>
                <p className="eyebrow accent">Subject details</p>
                <h2>Verification assessment sheet</h2>
              </div>
              <span className="autosave">Saved locally · {formatDate(verification.updatedAt)}</span>
            </div>
            <div className="details-grid">
              <Field label="Staff name(s)" required>
                <input value={verification.staffNames} onChange={(event) => updateDetails('staffNames', event.target.value)} placeholder="e.g. Dr Maria Kila, Mr Peter Wane" disabled={!lecturerMode} />
              </Field>
              <Field label="School" required>
                <input value={verification.school} onChange={(event) => updateDetails('school', event.target.value)} placeholder="e.g. School of Information and Communication Technology" disabled={!lecturerMode} />
              </Field>
              <Field label="Subject" required>
                <input value={verification.subject} onChange={(event) => updateDetails('subject', event.target.value)} placeholder="e.g. Data Structures" disabled={!lecturerMode} />
              </Field>
              <Field label="Subject code" required>
                <input value={verification.subjectCode} onChange={(event) => updateDetails('subjectCode', event.target.value)} placeholder="e.g. ICT202" disabled={!lecturerMode} />
              </Field>
              <Field label="Semester" required>
                <select value={verification.semester} onChange={(event) => updateDetails('semester', event.target.value as '1' | '2')} disabled={!lecturerMode}>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </Field>
              <Field label="Year" required>
                <input value={verification.year} onChange={(event) => updateDetails('year', event.target.value)} inputMode="numeric" disabled={!lecturerMode} />
              </Field>
              <ChoiceField label="Submitted by lecturer?" value={verification.submitted} disabled={!lecturerMode || verification.status !== 'draft'} onChange={(value) => updateDetails('submitted', value)} />
              <ChoiceField label="Head of School present?" value={verification.hosPresent} disabled={!hosMode || verification.status !== 'submitted'} onChange={(value) => updateDetails('hosPresent', value)} />
              <ChoiceField label="Head of School signed?" value={verification.hosSigned} disabled={!hosMode || verification.status !== 'submitted'} onChange={(value) => updateDetails('hosSigned', value)} />
            </div>
          </form>

          <section className="panel checklist-panel" aria-labelledby="checklist-title">
            <div className="panel-heading checklist-heading">
              <div>
                <p className="eyebrow accent">12 scored checks · 2 supporting records</p>
                <h2 id="checklist-title">Checklist, evidence and reviewer assessment</h2>
                <p>Complete, Incomplete and Nil are mutually exclusive ratings. The 12 scored checks total a maximum of 24 points.</p>
              </div>
              <div className="evidence-summary">{evidenceCount} file{evidenceCount === 1 ? '' : 's'} attached</div>
            </div>

            <div className="checklist-legend" aria-label="Rating scale">
              <span><b className="complete-dot" />Complete = 2</span>
              <span><b className="incomplete-dot" />Incomplete = 1</span>
              <span><b className="nil-dot" />Nil = 0</span>
            </div>

            <div className="checklist">
              {verification.checklist.map((entry) => (
                <article className="check-row" key={entry.id}>
                  <div className="check-number">{entry.section}</div>
                  <div className="check-main">
                    <h3>{entry.title}</h3>
                    <p>{entry.guidance}</p>
                    <div className="evidence-list" aria-label={`Evidence for ${entry.title}`}>
                      {entry.evidence.map((file, index) => (
                        <span className="file-chip" key={`${file.name}-${index}`}>
                          <span>⌁</span> {file.name}
                          {lecturerMode && verification.status === 'draft' && <button onClick={() => removeEvidence(entry.id, index)} aria-label={`Remove ${file.name}`}>×</button>}
                        </span>
                      ))}
                      {lecturerMode && verification.status === 'draft' && (
                        <label className="upload-button">
                          <input type="file" onChange={(event) => uploadEvidence(entry.id, event)} multiple />
                          {entry.evidence.length ? 'Add evidence' : 'Upload evidence'}
                        </label>
                      )}
                    </div>
                  </div>
                  <fieldset className="ratings" disabled={!canRate || verification.status === 'approved'}>
                    <legend>Rating for section {entry.section}</legend>
                    {([2, 1, 0] as const).map((rating) => (
                      <label className={`rating rating-${rating} ${entry.rating === rating ? 'selected' : ''}`} key={rating}>
                        <input type="radio" name={`rating-${entry.id}`} checked={entry.rating === rating} onChange={() => updateEntry(entry.id, { rating })} />
                        <span>{ratingCopy[rating]}</span><b>{rating}</b>
                      </label>
                    ))}
                  </fieldset>
                  <label className="comment-box">
                    <span>Reviewer comment</span>
                    <textarea value={entry.comment} onChange={(event) => updateEntry(entry.id, { comment: event.target.value })} placeholder={canRate ? 'Record observation or required action' : 'Available during AQAT review'} disabled={!canRate} />
                  </label>
                </article>
              ))}
              <article className="supporting-row">
                <span className="check-number">13</span>
                <div><h3>Examiners’ report</h3><p>Retain the completed examiner’s report with the subject file.</p></div>
                <span className="not-scored">Supporting record</span>
              </article>
              <article className="supporting-row">
                <span className="check-number">14</span>
                <div><h3>Annual review of the subject</h3><p>Include the continuous assessment break-up, consolidation attendance percentage, and CA plus final exam marks and grade.</p></div>
                <span className="not-scored">Supporting record</span>
              </article>
            </div>
          </section>
        </section>

        <aside className="workflow-panel">
          <section className="panel action-panel">
            <p className="eyebrow accent">Workflow actions</p>
            <h2>{reviewerMode ? 'AQAT reviewer desk' : hosMode ? 'Head of School desk' : 'Lecturer desk'}</h2>
            {lecturerMode && (
              <>
                <p className="muted">Attach evidence for each checklist item, then submit the sheet to the Head of School.</p>
                {!isSubmissionWindowOpen(submissionSettings) && <p className="submission-window-notice">{submissionWindowMessage(submissionSettings)}</p>}
                <button className="button primary" onClick={submitToHos} disabled={verification.status !== 'draft' || !isSubmissionWindowOpen(submissionSettings)}>Submit to Head of School</button>
                <div className="completion-meter">
                  <div><span>Evidence completion</span><b>{verification.checklist.filter((entry) => entry.evidence.length).length} / 12</b></div>
                  <progress max="12" value={verification.checklist.filter((entry) => entry.evidence.length).length} />
                </div>
              </>
            )}
            {hosMode && (
              <>
                <p className="muted">Confirm that the lecturer has presented the subject file, then record your name, presence and signature before forwarding the record to AQAT.</p>
                <Field label="Head of School name">
                  <input value={verification.hosName} onChange={(event) => updateDetails('hosName', event.target.value)} placeholder={session.name} disabled={verification.status !== 'submitted'} />
                </Field>
                <button className="button primary" onClick={verifyHos} disabled={verification.status !== 'submitted'}>Verify and forward to AQAT</button>
              </>
            )}
            {reviewerMode && (
              <>
                <p className="muted">Review submitted evidence, select one rating per scored check and document actionable comments.</p>
                {verification.status === 'hos-verified' && <button className="button primary" onClick={beginReview}>Begin AQAT review</button>}
                {verification.status === 'under-review' && (
                  <>
                    <div className="review-progress">
                      <span>Assessment progress</span>
                      <strong>{verification.checklist.filter((entry) => entry.rating !== null).length} / 12 rated</strong>
                    </div>
                    <div className="bulk-rating">
                      <span>Rate all checklist items</span>
                      <div>
                        <button onClick={() => rateAll(2)}>Complete · 24/24</button>
                        <button onClick={() => rateAll(1)}>Incomplete · 12/24</button>
                        <button onClick={() => rateAll(0)}>Nil · 0/24</button>
                      </div>
                    </div>
                  </>
                )}
                <hr />
                <Field label="AQAT Chairperson name">
                  <input value={verification.chairName} onChange={(event) => updateDetails('chairName', event.target.value)} placeholder="Chairperson name" disabled={verification.status === 'approved'} />
                </Field>
                <ChoiceField label="Chairperson approval?" value={verification.chairApproval} disabled={verification.status !== 'under-review'} onChange={(value) => updateDetails('chairApproval', value)} />
                <button className="button primary" onClick={approve} disabled={verification.status !== 'under-review'}>Record final approval</button>
              </>
            )}
          </section>

          <section className="panel score-panel">
            <p className="eyebrow accent">Assessment result</p>
            <div className="score-line"><span>Total marks</span><strong>{score} / {MAX_SCORE}</strong></div>
            <div className="score-line large"><span>AQAT result</span><strong>{scaledScore.toFixed(2)} <small>/ 4</small></strong></div>
            <progress max={MAX_SCORE} value={score} />
            <p>Complete: {ratingSummary.complete} · Incomplete: {ratingSummary.incomplete} · Nil: {ratingSummary.nil}</p>
            <p>Formula: total marks ÷ {MAX_SCORE} × 4. The assessment remains a maximum of 24 points.</p>
            <label className="result-file-name">
              <span>Rename result file</span>
              <input value={resultFileName} onChange={(event) => setResultFileName(event.target.value)} placeholder={suggestedResultFilename(verification, platformSettings.resultPrefix)} aria-label="PDF result filename" />
              <small>.pdf is added automatically</small>
            </label>
            <button className="download-result-button" onClick={downloadResult} disabled={isDownloading}>{isDownloading ? 'Creating PDF...' : 'Download PDF result'}</button>
          </section>

          <button className="reset-button" onClick={resetSheet}>Start a new verification sheet</button>
        </aside>
      </div>
      <nav className="mobile-app-nav" aria-label="Mobile application actions">
        <button onClick={() => setShowTutorial(true)}><span aria-hidden="true">?</span>Tutorial</button>
        <button onClick={downloadResult} disabled={isDownloading}><span aria-hidden="true">↓</span>{isDownloading ? 'Creating' : 'PDF result'}</button>
        {isAdministrator && <button onClick={() => setAdminDashboard(true)}><span aria-hidden="true">⌂</span>Dashboard</button>}
        <button onClick={logout}><span aria-hidden="true">↗</span>Sign out</button>
      </nav>
        </>
      )}
      {showSearch && (
        <PlatformSearch
          query={platformSearch}
          verification={verification}
          allocations={allocations}
          onQueryChange={setPlatformSearch}
          onClose={() => { setShowSearch(false); setPlatformSearch(''); }}
          onOpenAllocations={() => { setActiveArea('allocations'); setShowSearch(false); setPlatformSearch(''); }}
        />
      )}
    </main>
  );
}

function formatBoolean(value: boolean | null) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return 'Not recorded';
}

async function getImageData(path: string) {
  const response = await window.fetch(path);
  if (!response.ok) throw new Error(`Unable to load PDF logo: ${response.status}`);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="field"><span>{label}{required && <b aria-label="required"> *</b>}</span>{children}</label>;
}

function ChoiceField({ label, value, disabled, onChange }: { label: string; value: boolean | null; disabled?: boolean; onChange: (value: boolean) => void }) {
  const name = label.replace(/\W/g, '-').toLowerCase();
  return (
    <fieldset className="choice-field" disabled={disabled}>
      <legend>{label}</legend>
      <label><input type="radio" name={name} checked={value === true} onChange={() => onChange(true)} /> Yes</label>
      <label><input type="radio" name={name} checked={value === false} onChange={() => onChange(false)} /> No</label>
    </fieldset>
  );
}

function TeachingAllocationsPage({
  allocations, currentUser, canUpload, submissionOpen, submissionMessage, onAdd,
}: {
  allocations: TeachingAllocation[];
  currentUser: string;
  canUpload: boolean;
  submissionOpen: boolean;
  submissionMessage: string;
  onAdd: (allocation: TeachingAllocation) => void;
}) {
  const [school, setSchool] = useState('');
  const [campus, setCampus] = useState('');
  const [semester, setSemester] = useState<'1' | '2'>('1');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [files, setFiles] = useState<File[]>([]);
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState('');

  const visibleAllocations = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return allocations;
    return allocations.filter((allocation) => [
      allocation.school,
      allocation.campus,
      allocation.submittedBy,
      allocation.year,
      ...allocation.files.map((file) => file.name),
    ].join(' ').toLowerCase().includes(term));
  }, [allocations, filter]);

  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []));
  }

  function submitAllocation(event: FormEvent) {
    event.preventDefault();
    if (!school.trim() || !files.length) {
      setMessage('Enter the school or department and select at least one teaching allocation file.');
      return;
    }
    const submittedAt = new Date().toISOString();
    onAdd({
      id: crypto.randomUUID(),
      school: school.trim(),
      campus: campus.trim(),
      semester,
      year: year.trim() || String(new Date().getFullYear()),
      submittedBy: currentUser,
      submittedAt,
      files: files.map((file) => ({ name: file.name, size: file.size, addedAt: submittedAt })),
    });
    setSchool('');
    setCampus('');
    setFiles([]);
    setMessage(`${files.length} teaching allocation file${files.length === 1 ? '' : 's'} uploaded and ready for AQAT.`);
  }

  return (
    <section className="allocation-workspace">
      <div className="allocation-intro">
        <div>
          <p className="eyebrow accent">Lecturer workspace</p>
          <h2>Teaching allocations</h2>
          <p>Upload the approved teaching allocation for your school, department or campus. AQAT can then find the record by school, lecturer or filename.</p>
        </div>
        <label className="allocation-search">
          <span aria-hidden="true">⌕</span>
          <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search allocations by school, lecturer or filename" />
        </label>
      </div>

      <div className="allocation-grid">
        <section className="panel allocation-upload-panel">
          <p className="eyebrow accent">Submit allocation</p>
          <h3>Upload teaching allocation</h3>
          {canUpload ? (
            <form onSubmit={submitAllocation}>
              <div className="allocation-form-grid">
                <Field label="School or department" required>
                  <input value={school} onChange={(event) => setSchool(event.target.value)} placeholder="e.g. School of Agriculture" required />
                </Field>
                <Field label="Campus">
                  <input value={campus} onChange={(event) => setCampus(event.target.value)} placeholder="e.g. Main Campus or Bulolo Campus" />
                </Field>
                <Field label="Semester" required>
                  <select value={semester} onChange={(event) => setSemester(event.target.value as '1' | '2')}>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </Field>
                <Field label="Year" required>
                  <input value={year} onChange={(event) => setYear(event.target.value)} inputMode="numeric" required />
                </Field>
              </div>
              <label className="allocation-dropzone">
                <input type="file" accept=".pdf,.xlsx,.xls,.csv,.doc,.docx" multiple onChange={chooseFiles} />
                <strong>Choose allocation files</strong>
                <span>PDF, spreadsheet or document · select more than one file if needed</span>
              </label>
              {files.length > 0 && <div className="pending-files">{files.map((file) => <span key={`${file.name}-${file.size}`}>{file.name}</span>)}</div>}
              {message && <p className="allocation-message" role="status">{message}</p>}
              <button className="button primary" type="submit">Upload teaching allocation</button>
            </form>
          ) : (
            <p className="muted">{submissionOpen ? 'Teaching allocation uploads are available in the lecturer workspace. QA reviewers can search and view submitted records.' : `${submissionMessage} Teaching allocation uploads are unavailable while the submission window is closed.`}</p>
          )}
        </section>

        <section className="panel allocation-records-panel">
          <div className="panel-heading">
            <div><p className="eyebrow accent">Allocation register</p><h3>Submitted teaching allocations</h3></div>
            <span className="autosave">{visibleAllocations.length} record{visibleAllocations.length === 1 ? '' : 's'}</span>
          </div>
          <div className="allocation-records">
            {visibleAllocations.length ? visibleAllocations.map((allocation) => (
              <article className="allocation-record" key={allocation.id}>
                <div>
                  <h4>{allocation.school}</h4>
                  <p>{allocation.campus || 'Main campus'} · Semester {allocation.semester}, {allocation.year}</p>
                  <span>Uploaded by {allocation.submittedBy} · {formatDate(allocation.submittedAt)}</span>
                </div>
                <div className="allocation-files">
                  {allocation.files.map((file) => <span className="file-chip" key={`${allocation.id}-${file.name}`}>⌁ {file.name}</span>)}
                </div>
              </article>
            )) : <p className="empty-allocations">No teaching allocations match this search.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}

function PlatformSearch({
  query, verification, allocations, onQueryChange, onClose, onOpenAllocations,
}: {
  query: string;
  verification: Verification;
  allocations: TeachingAllocation[];
  onQueryChange: (value: string) => void;
  onClose: () => void;
  onOpenAllocations: () => void;
}) {
  const term = query.trim().toLowerCase();
  const matchingAllocations = term ? allocations.filter((allocation) => [
    allocation.school,
    allocation.campus,
    allocation.submittedBy,
    ...allocation.files.map((file) => file.name),
  ].join(' ').toLowerCase().includes(term)) : allocations.slice(0, 4);
  const matchingSubject = term && [
    verification.subject,
    verification.subjectCode,
    verification.school,
    verification.staffNames,
  ].join(' ').toLowerCase().includes(term);

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-labelledby="platform-search-title">
      <section className="platform-search-dialog">
        <div className="platform-search-heading">
          <div><p className="eyebrow accent">AQAT platform search</p><h2 id="platform-search-title">Find a record</h2></div>
          <button onClick={onClose} aria-label="Close platform search">×</button>
        </div>
        <label className="platform-search-input">
          <span aria-hidden="true">⌕</span>
          <input autoFocus value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search school, lecturer, subject code or filename" />
        </label>
        <div className="search-results">
          {matchingSubject && (
            <button className="search-result" onClick={onClose}>
              <span>Subject verification</span>
              <strong>{verification.subjectCode || 'Subject code not recorded'} · {verification.subject || 'Subject details not recorded'}</strong>
              <small>{verification.school || 'School not recorded'}</small>
            </button>
          )}
          {matchingAllocations.map((allocation) => (
            <button className="search-result" key={allocation.id} onClick={onOpenAllocations}>
              <span>Teaching allocation</span>
              <strong>{allocation.school} · Semester {allocation.semester}, {allocation.year}</strong>
              <small>{allocation.files.map((file) => file.name).join(', ')}</small>
            </button>
          ))}
          {!matchingSubject && matchingAllocations.length === 0 && <p className="empty-allocations">{term ? `No AQAT records match “${query}”.` : 'Start typing to search subject and teaching allocation records.'}</p>}
        </div>
      </section>
    </div>
  );
}

function LoginPage({ onLogin, onShowTutorial }: { onLogin: (name: string, role: UserRole) => void; onShowTutorial: () => void }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('administrator');
  const [googleMessage, setGoogleMessage] = useState('');
  const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim();

  function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim() && password.trim()) onLogin(name.trim(), role);
  }

  function signInWithGoogle() {
    if (!googleClientId) {
      setGoogleMessage('Google sign-in needs an institutional Google client ID. Add VITE_GOOGLE_CLIENT_ID to the deployment environment to enable it.');
      return;
    }

    const handleCredential = (credential: string) => {
      try {
        const payload = credential.split('.')[1];
        const profile = JSON.parse(window.atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { name?: string; email?: string };
        onLogin(profile.name || profile.email || 'Google account', role);
      } catch {
        setGoogleMessage('Google sign-in could not read the account profile. Please try again.');
      }
    };
    const launch = () => {
      const google = (window as Window & {
        google?: { accounts?: { id?: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          prompt: () => void;
        } } };
      }).google;
      if (!google?.accounts?.id) {
        setGoogleMessage('Google sign-in could not load. Check the internet connection and try again.');
        return;
      }
      google.accounts.id.initialize({ client_id: googleClientId, callback: (response) => handleCredential(response.credential) });
      google.accounts.id.prompt();
    };

    const scriptId = 'google-identity-services';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      launch();
      return;
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = launch;
    script.onerror = () => setGoogleMessage('Google sign-in could not load. Check the internet connection and try again.');
    document.head.appendChild(script);
  }

  return (
    <main className="login-shell">
      <section className="login-panel">
        <img className="login-logo" src={assetUrl('png-unitech-wordmark.jpg')} alt="Papua New Guinea University of Technology" />
        <p className="eyebrow accent">AQAT secure access</p>
        <h1>Sign in to the subject verification workflow</h1>
        <p>Administrator access opens the AQAT dashboard and controls the workflow views. Use the dedicated Lecturer login to upload subject evidence and submit the verification sheet.</p>
        <form onSubmit={submit}>
          <Field label="Full name or staff ID" required>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Ms Dora Jimela Kialo" autoComplete="username" required />
          </Field>
          <Field label="Password" required>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
          </Field>
          <fieldset className="login-role-picker">
            <legend>Select login section</legend>
            <label className={role === 'administrator' ? 'selected' : ''}>
              <input type="radio" name="login-role" checked={role === 'administrator'} onChange={() => setRole('administrator')} />
              <strong>Administrator</strong><span>Control the dashboard and workflow views.</span>
            </label>
            <label className={role === 'lecturer' ? 'selected lecturer-login-card' : 'lecturer-login-card'}>
              <input type="radio" name="login-role" checked={role === 'lecturer'} onChange={() => setRole('lecturer')} />
              <strong>Lecturer login</strong><span>Upload evidence and submit the sheet to HoS.</span>
            </label>
            <label className={role === 'hos' ? 'selected hos-login-card' : 'hos-login-card'}>
              <input type="radio" name="login-role" checked={role === 'hos'} onChange={() => setRole('hos')} />
              <strong>Head of School</strong><span>Confirm submission and sign before AQAT review.</span>
            </label>
            <label className={role === 'reviewer' ? 'selected' : ''}>
              <input type="radio" name="login-role" checked={role === 'reviewer'} onChange={() => setRole('reviewer')} />
              <strong>QA reviewer</strong><span>Assess evidence, comment and approve.</span>
            </label>
          </fieldset>
          {role === 'lecturer' && <div className="lecturer-login-hint"><strong>Lecturer workflow:</strong> complete the subject details, attach evidence for all 12 checks, then submit the record for Head of School verification.</div>}
          {role === 'hos' && <div className="lecturer-login-hint"><strong>Head of School workflow:</strong> review the submitted subject file, record your presence and signature, then forward it to AQAT.</div>}
          <button className="button primary" type="submit">Sign in</button>
        </form>
        <div className="login-divider"><span>or</span></div>
        <button className="google-sign-in-button" onClick={signInWithGoogle}><span aria-hidden="true">G</span>Continue with Google</button>
        {googleMessage && <p className="google-sign-in-message" role="status">{googleMessage}</p>}
        <button className="login-tutorial-link" onClick={onShowTutorial}>Read the platform tutorial</button>
        <small>This prototype records the selected local session in this browser. Google sign-in must be configured with an institutional client ID and verified by a secure server before production use.</small>
      </section>
    </main>
  );
}

function AdminDashboard({
  verification, score, scaledScore, administratorName, downloading, resultFileName, suggestedFilename, onOpenWorkflow, onOpenAllocations, submissionSettings, onSubmissionSettingsChange, platformSettings, onPlatformSettingsChange, onDownload, onResultFileNameChange, onShowTutorial, onLogout,
}: {
  verification: Verification;
  score: number;
  scaledScore: number;
  administratorName: string;
  downloading: boolean;
  resultFileName: string;
  suggestedFilename: string;
  onOpenWorkflow: (role: WorkflowRole) => void;
  onOpenAllocations: () => void;
  submissionSettings: SubmissionSettings;
  onSubmissionSettingsChange: (settings: SubmissionSettings) => void;
  platformSettings: PlatformSettings;
  onPlatformSettingsChange: (settings: PlatformSettings) => void;
  onDownload: () => void;
  onResultFileNameChange: (value: string) => void;
  onShowTutorial: () => void;
  onLogout: () => void;
}) {
  const evidenceCount = verification.checklist.reduce((total, entry) => total + entry.evidence.length, 0);
  const ratingCount = verification.checklist.filter((entry) => entry.rating !== null).length;

  return (
    <main className="admin-shell">
      <header className="topbar">
        <div className="brand">
          <img className="unitech-logo" src={assetUrl('png-unitech-wordmark.jpg')} alt="Papua New Guinea University of Technology" />
          <div><p className="eyebrow">Administrator control centre</p><h1>AQAT Dashboard</h1></div>
        </div>
        <div className="topbar-actions"><span className="signed-in-as">Administrator: {administratorName}</span><button className="tutorial-link" onClick={onShowTutorial}>How to use AQAT</button><button className="logout-button" onClick={onLogout}>Sign out</button></div>
      </header>
      <section className="admin-content">
        <p className="eyebrow accent">AQAT administration</p>
        <h1>Subject verification dashboard</h1>
        <p className="admin-intro">Monitor the current assessment record, control who works in each workflow view, and issue the branded AQAT PDF result.</p>
        <div className="dashboard-cards">
          <article><span>Workflow status</span><strong>{statusCopy[verification.status]}</strong></article>
          <article><span>Evidence records</span><strong>{evidenceCount} <small>files</small></strong></article>
          <article><span>Reviewer ratings</span><strong>{ratingCount} <small>/ 12</small></strong></article>
          <article><span>Current result</span><strong>{scaledScore.toFixed(2)} <small>/ 4</small></strong><em>{score} / {MAX_SCORE} points</em></article>
        </div>
        <section className="summary-report panel" aria-labelledby="agriculture-summary-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow accent">AQAT summary report data</p>
              <h2 id="agriculture-summary-title">School of Agriculture · 2026 Semester One (1)</h2>
            </div>
            <span className="autosave">{AGRICULTURE_SUMMARY_REPORT.length} subject files</span>
          </div>
          <div className="summary-report-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>No.</th><th>Lecturer / staff</th><th>Subject title</th><th>Subject code</th><th>PG/UG</th><th>Subject file required</th><th>Assessment comments</th><th>Rate</th><th>Submission date</th>
                </tr>
              </thead>
              <tbody>
                {AGRICULTURE_SUMMARY_REPORT.map((entry) => (
                  <tr key={entry.number}>
                    <td>{entry.number}</td><td>{entry.staff}</td><td>{entry.subjectTitle}</td><td>{entry.subjectCode}</td><td>{entry.level}</td><td>{entry.subjectFileRequired}</td><td>{entry.assessmentComment}</td><td>{entry.rate}</td><td>{entry.submissionDate}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr><th colSpan={9}>Source-reported summary: Sum 60 · Average 4.00</th></tr>
              </tfoot>
            </table>
          </div>
        </section>
        <section className="summary-report panel" aria-labelledby="applied-science-summary-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow accent">AQAT summary report data</p>
              <h2 id="applied-science-summary-title">School of Applied Science · 2026 Semester One (1)</h2>
            </div>
            <span className="autosave">{APPLIED_SCIENCE_SUMMARY_REPORT.length} staff records</span>
          </div>
          <div className="summary-report-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>No.</th><th>Department</th><th>Lecturer / staff</th><th>Subject title</th><th>Subject code</th><th>PG/UG</th><th>Subject file required</th><th>Assessment</th><th>Comments</th><th>Rate</th><th>Submission date</th>
                </tr>
              </thead>
              <tbody>
                {APPLIED_SCIENCE_SUMMARY_REPORT.map((entry) => (
                  <tr key={entry.number}>
                    <td>{entry.number}</td><td>{entry.department}</td><td>{entry.staff}</td><td>{entry.subjectTitle}</td><td>{entry.subjectCode}</td><td>{entry.level}</td><td>{entry.subjectFileRequired}</td><td>{entry.assessmentComment}</td><td>{entry.rate ? 'Stacked neatly on CD/GD' : '—'}</td><td>{entry.rate}</td><td>{entry.submissionDate}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr><th colSpan={11}>Source-reported summary: Sum 92 · Average 3.50</th></tr>
              </tfoot>
            </table>
          </div>
        </section>
        <section className="dashboard-actions">
          <div>
            <h2>Workflow control</h2>
            <p>Open the appropriate controlled view to collect evidence or conduct AQAT review.</p>
            <button className="button primary" onClick={() => onOpenWorkflow('lecturer')}>Open lecturer view</button>
            <button className="button tertiary" onClick={() => onOpenWorkflow('hos')}>Open Head of School view</button>
            <button className="button secondary" onClick={() => onOpenWorkflow('reviewer')}>Open QA reviewer view</button>
            <button className="button tertiary" onClick={onOpenAllocations}>Open teaching allocations</button>
          </div>
          <div>
            <h2>Assessment result</h2>
            <p>Download a PDF with the University crest, subject details, each rating, comments, evidence register and approval record.</p>
            <label className="dashboard-file-name">
              <span>Rename result file</span>
              <input value={resultFileName} onChange={(event) => onResultFileNameChange(event.target.value)} placeholder={suggestedFilename} aria-label="PDF result filename" />
              <small>.pdf is added automatically</small>
            </label>
            <button className="download-result-button" onClick={onDownload} disabled={downloading}>{downloading ? 'Creating PDF...' : 'Download PDF result'}</button>
          </div>
          <div className="submission-settings">
            <p className="eyebrow accent">Submission control</p>
            <h2>Lecturer submission window</h2>
            <p>Control whether lecturers can upload teaching allocations and submit evidence to the Head of School.</p>
            <label className="submission-toggle">
              <input
                type="checkbox"
                checked={submissionSettings.isOpen}
                onChange={(event) => onSubmissionSettingsChange({ ...submissionSettings, isOpen: event.target.checked })}
              />
              <span aria-hidden="true" />
              <strong>{submissionSettings.isOpen ? 'Submissions on' : 'Submissions off'}</strong>
            </label>
            <Field label="Submission due date">
              <input
                type="date"
                value={submissionSettings.dueDate}
                onChange={(event) => onSubmissionSettingsChange({ ...submissionSettings, dueDate: event.target.value })}
              />
            </Field>
            <small>{submissionWindowMessage(submissionSettings)}</small>
          </div>
          <section className="platform-settings">
            <p className="eyebrow accent">Platform settings</p>
            <h2>Branding and administration</h2>
            <p>These settings are saved in this browser and update the platform header and generated result file names.</p>
            <div className="platform-settings-grid">
              <Field label="Platform name">
                <input
                  value={platformSettings.platformName}
                  onChange={(event) => onPlatformSettingsChange({ ...platformSettings, platformName: event.target.value })}
                  placeholder={DEFAULT_PLATFORM_NAME}
                />
              </Field>
              <Field label="Institution name">
                <input
                  value={platformSettings.institutionName}
                  onChange={(event) => onPlatformSettingsChange({ ...platformSettings, institutionName: event.target.value })}
                  placeholder="Papua New Guinea University of Technology"
                />
              </Field>
              <Field label="Support email">
                <input
                  type="email"
                  value={platformSettings.supportEmail}
                  onChange={(event) => onPlatformSettingsChange({ ...platformSettings, supportEmail: event.target.value })}
                  placeholder="e.g. aqat@unitech.ac.pg"
                />
              </Field>
              <Field label="Result filename prefix">
                <input
                  value={platformSettings.resultPrefix}
                  onChange={(event) => onPlatformSettingsChange({ ...platformSettings, resultPrefix: event.target.value })}
                  placeholder="aqat"
                />
              </Field>
            </div>
            <div className="google-connection-status">
              <strong>Google sign-in</strong>
              <span>{import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Institutional Google sign-in is configured for this build.' : 'Not configured — add VITE_GOOGLE_CLIENT_ID in the hosting environment.'}</span>
            </div>
          </section>
        </section>
      </section>
      <nav className="mobile-app-nav" aria-label="Mobile administrator actions">
        <button onClick={onShowTutorial}><span aria-hidden="true">?</span>Tutorial</button>
        <button onClick={onDownload} disabled={downloading}><span aria-hidden="true">↓</span>{downloading ? 'Creating' : 'PDF result'}</button>
        <button onClick={onLogout}><span aria-hidden="true">↗</span>Sign out</button>
      </nav>
    </main>
  );
}

function PlatformTutorial({ signedIn, onBack }: { signedIn: boolean; onBack: () => void }) {
  const steps = [
    ['1', 'Sign in to the right work area', 'Administrators sign in to the dashboard. Lecturers upload evidence, Heads of School confirm submissions, and AQAT reviewers assess the completed record.'],
    ['2', 'Lecturer prepares the subject file', 'Enter staff and subject details, then attach evidence to every one of the 12 scored verification checks.'],
    ['3', 'Head of School verifies the record', 'The Head of School signs in to their own desk, reviews the submitted record, then confirms their name, presence and signature before forwarding it to AQAT.'],
    ['4', 'AQAT reviewer assesses the evidence', 'Select exactly one rating for each check: Complete (2), Incomplete (1), or Nil (0). Add useful reviewer comments.'],
    ['5', 'Approve and retain the result', 'Record the Chairperson approval. The result converts the total out of 24 into an AQAT score out of 4, and can be downloaded as a branded PDF.'],
  ];

  return (
    <main className="tutorial-shell">
      <header className="tutorial-header">
        <img className="login-logo" src={assetUrl('png-unitech-wordmark.jpg')} alt="Papua New Guinea University of Technology" />
        <button className="tutorial-back-button" onClick={onBack}>{signedIn ? 'Return to AQAT' : 'Return to sign in'}</button>
      </header>
      <section className="tutorial-content">
        <p className="eyebrow accent">Platform tutorial</p>
        <h1>How to use the AQAT subject verification platform</h1>
        <p className="tutorial-intro">Follow this sequence to create a complete, reviewable subject file and produce an approved AQAT result.</p>
        <div className="tutorial-steps">
          {steps.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <div><h2>{title}</h2><p>{description}</p></div>
            </article>
          ))}
        </div>
        <section className="tutorial-note">
          <h2>Role guide</h2>
          <p><strong>Administrators</strong> control dashboard access and workflow views. <strong>Lecturers</strong> add evidence. <strong>Heads of School</strong> verify submissions. <strong>QA reviewers</strong> assess and finalise the result.</p>
        </section>
      </section>
    </main>
  );
}
