export default defineEventHandler(async (event) => {
    const params = getRouterParams(event);
    const file = await minioClient.getObject(BUCKET_NAME, params.id);
    return sendStream(event, file);
});