export const extractKeyFromS3Url = (url: string): string => {
    const bucket = process.env.AWS_BUCKET_NAME!;
    return url.split(`${bucket}.s3.ap-southeast-2.amazonaws.com/`)[1];
};