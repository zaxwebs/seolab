import PocketBase, { type RecordModel } from 'pocketbase';

export const EXPERIMENT_STATUSES = [
	'Planned',
	'Running',
	'Monitoring',
	'Won',
	'Lost',
	'Inconclusive',
	'Abandoned'
] as const;

export const ACTIVE_STATUSES = ['Planned', 'Running', 'Monitoring'] as const;

export const EXPERIMENT_TYPES = [
	'Title tag change',
	'Meta description change',
	'Content expansion',
	'Content pruning',
	'Internal linking',
	'Schema markup',
	'Page template change',
	'Programmatic page generation',
	'Technical SEO change',
	'CTR optimization',
	'Search intent rewrite',
	'Other'
] as const;

export const LOG_TYPES = [
	'Implementation',
	'Observation',
	'Metric update',
	'Issue',
	'External event',
	'Decision',
	'Note'
] as const;

export const CONFIDENCE_LEVELS = ['Low', 'Medium', 'High'] as const;

export type ExperimentStatus = (typeof EXPERIMENT_STATUSES)[number];
export type ExperimentType = (typeof EXPERIMENT_TYPES)[number];
export type LogType = (typeof LOG_TYPES)[number];
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

export type Website = RecordModel & {
	name: string;
	domain: string;
	description?: string;
	market?: string;
	archived?: boolean;
};

export type Experiment = RecordModel & {
	website: string;
	title: string;
	hypothesis: string;
	experiment_type: ExperimentType;
	status: ExperimentStatus;
	target_urls?: string[];
	control_urls?: string[];
	primary_metric: string;
	secondary_metrics?: string[];
	start_date?: string;
	expected_review_date?: string;
	end_date?: string;
	baseline_notes?: string;
	implementation_notes?: string;
	result_summary?: string;
	confidence?: Confidence;
	learnings?: string;
	next_action?: string;
	tags?: string[];
};

export type ExperimentLog = RecordModel & {
	experiment: string;
	log_type: LogType;
	log_date: string;
	note: string;
	metric_snapshot?: Record<string, string>;
	source_url?: string;
};

export type WebsiteStats = {
	total: number;
	active: number;
	lastActivity?: string;
};

export const pbUrls = [
	import.meta.env.VITE_PB_URL,
	'http://127.0.0.1:8090',
	'http://localhost:8090'
].filter(Boolean) as string[];

export function createPocketBase(url = pbUrls[0]): PocketBase {
	const client = new PocketBase(url);
	client.autoCancellation(false);
	return client;
}

export const pb = createPocketBase();

export function linesToArray(value: string): string[] {
	return value
		.split(/\r?\n/)
		.map((item) => item.trim())
		.filter(Boolean);
}

export function commaToArray(value: string): string[] {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

export function arrayToLines(value?: string[]): string {
	return (value ?? []).join('\n');
}

export function arrayToComma(value?: string[]): string {
	return (value ?? []).join(', ');
}

export function toDateInput(value?: string): string {
	if (!value) return '';
	return value.slice(0, 10);
}

export function formatDisplayDate(value?: string): string {
	const date = toDateInput(value);
	if (!date) return '';
	const [year, month, day] = date.split('-').map(Number);
	if (!year || !month || !day) return '';
	const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(Date.UTC(year, month - 1, day)));
	return `${day} ${monthLabel}, ${year}`;
}

export function todayInput(): string {
	return new Date().toISOString().slice(0, 10);
}

export function isActiveStatus(status: string): boolean {
	return ACTIVE_STATUSES.includes(status as (typeof ACTIVE_STATUSES)[number]);
}

export function isReadyForReview(experiment: Experiment): boolean {
	if (!isActiveStatus(experiment.status) || !experiment.expected_review_date) return false;
	return toDateInput(experiment.expected_review_date) <= todayInput();
}

export function daysUntil(dateValue?: string): number | undefined {
	const date = toDateInput(dateValue);
	if (!date) return undefined;
	const today = new Date(`${todayInput()}T00:00:00`);
	const target = new Date(`${date}T00:00:00`);
	if (Number.isNaN(target.getTime())) return undefined;
	return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function isInReviewQueue(experiment: Experiment, windowDays = 7): boolean {
	if (!isActiveStatus(experiment.status)) return false;
	const days = daysUntil(experiment.expected_review_date);
	return days !== undefined && days <= windowDays;
}

export function reviewTimingLabel(dateValue?: string): string {
	const days = daysUntil(dateValue);
	if (days === undefined) return 'No review date';
	if (days < 0) return 'Overdue';
	if (days === 0) return 'Due today';
	if (days === 1) return 'Due tomorrow';
	return `Due in ${days} days`;
}

export function reviewTimingBadgeClass(dateValue?: string): string {
	const days = daysUntil(dateValue);
	if (days === undefined) return 'bg-muted text-muted-foreground hover:bg-muted';
	if (days < 0) return 'bg-destructive text-white hover:bg-destructive/90';
	if (days === 0) return 'bg-primary text-primary-foreground hover:bg-primary/90';
	return 'bg-teal-600 text-white hover:bg-teal-600/90';
}

export function statusBadgeClass(status: string): string {
	if (status === 'Planned') return 'bg-muted text-muted-foreground hover:bg-muted';
	if (status === 'Running') return 'bg-primary text-primary-foreground hover:bg-primary/90';
	if (status === 'Monitoring') return 'bg-sky-600 text-white hover:bg-sky-600/90';
	if (status === 'Won') return 'bg-emerald-600 text-white hover:bg-emerald-600/90';
	if (status === 'Lost') return 'bg-destructive text-white hover:bg-destructive/90';
	if (status === 'Inconclusive') return 'bg-teal-600 text-white hover:bg-teal-600/90';
	if (status === 'Abandoned') return 'bg-zinc-700 text-white hover:bg-zinc-700/90';
	return 'bg-muted text-muted-foreground hover:bg-muted';
}

export function logTypeBadgeClass(type: string): string {
	if (type === 'Decision') return 'bg-primary text-primary-foreground hover:bg-primary/90';
	if (type === 'Issue') return 'bg-destructive text-white hover:bg-destructive/90';
	if (type === 'Metric update') return 'bg-emerald-600 text-white hover:bg-emerald-600/90';
	if (type === 'Observation') return 'bg-teal-600 text-white hover:bg-teal-600/90';
	if (type === 'External event') return 'bg-sky-600 text-white hover:bg-sky-600/90';
	if (type === 'Implementation') return 'bg-foreground text-background hover:bg-foreground/90';
	return 'bg-muted text-muted-foreground hover:bg-muted';
}

export function relativeDate(value?: string): string {
	if (!value) return 'No activity';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return 'No activity';
	const days = Math.round((Date.now() - date.getTime()) / 86_400_000);
	if (days <= 0) return 'Today';
	if (days === 1) return 'Yesterday';
	return `${days} days ago`;
}
