
export interface ISendMessageCache {
    message: String;
    phone: String;
    subject: String;
    email: String;
    template: String;
    extras: any;
    from: String;
    tries: Number;
    createdAt: Date;
    updatedAt: Date;
    scheduledAt: Date;
    status: {
        type: String,
        enum: [String]
    };
}
