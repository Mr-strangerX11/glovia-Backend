export declare class OtpService {
    private readonly logger;
    private readonly gateway;
    generateOtp(): string;
    sendOtp(phone: string, otp: string, purpose: string): Promise<boolean>;
    private sendViaSparrow;
    private sendViaNTC;
    private sendViaMock;
    private buildMessage;
}
export declare class EmailOtpService {
    private readonly logger;
    private readonly provider;
    private transporter;
    constructor();
    sendEmailOtp(email: string, otp: string, purpose: string): Promise<boolean>;
    private sendViaSMTP;
    private sendViaSendGrid;
    private sendViaSES;
    private sendViaMock;
    private buildEmailContent;
}
