
export interface ISendMessageCache {
    message: string;
    phone: string;
    subject: string;
    email: string;
    template: string;
    extras: any;
    from: string;
    tries: number;
    createdAt: Date;
    updatedAt: Date;
    scheduledAt: Date;
    status: {
        type: string;
        enum: [string];
    };
}
