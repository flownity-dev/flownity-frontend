import type { ProjectStatus, TaskGroupStatus } from "../types/common.types";

/**
 * All possible API status values
 */
export type ApiStatus =
	| "backlog"
	| "todo"
	| "in-progress"
	| "in-review"
	| "blocked"
	| "on-hold"
	| "done"
	| "closed"
	| "cancelled";

/**
 * Maps API status string to ProjectStatus
 */
export const mapToProjectStatus = (
	status: string | null | undefined
): ProjectStatus => {
	if (!status || typeof status !== "string") {
		return "todo"; // Default for null/undefined status
	}

	const normalizedStatus = status.toLowerCase().trim() as ApiStatus;
	return normalizedStatus;
};

/**
 * Maps API status string to TaskGroupStatus
 */
export const mapToTaskGroupStatus = (
	status: string | null | undefined
): TaskGroupStatus => {
	if (!status || typeof status !== "string") {
		return "todo"; // Default for null/undefined status
	}

	const normalizedStatus = status.toLowerCase().trim() as ApiStatus;
	return normalizedStatus;
};
