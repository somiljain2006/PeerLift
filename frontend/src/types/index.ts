export enum TaskStatus {
    OPEN = 'OPEN',
    ACCEPTED = 'ACCEPTED',
    COMPLETED = 'COMPLETED',
}

export enum SubmissionStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export interface User {
    id: string;
    username: string;
    email: string;
    credits: number;
    tasksCompleted: number;
    rating: number;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    subject: string;
    rewardCredits: number;
    status: TaskStatus;
    postedBy?: User;
    acceptedBy?: User;
    createdAt: string;
    imageUrls: string[];
}

export interface Submission {
    taskId: number;
    submittedBy: string;
    imageUrls: string[];
    rating?: number;
    status: SubmissionStatus;
    feedback?: string;
}