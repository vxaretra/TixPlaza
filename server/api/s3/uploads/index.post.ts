export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "No files uploaded",
        });
    }

    const files = formData.filter(item => item.filename);
    if (files.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "No files uploaded",
        });
    }

    const bucketExist = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExist) {
        await minioClient.makeBucket(BUCKET_NAME);
    }

    const urls = [];

    for (const file of files) {
        const fileExt = file.type?.split("/")[1] || "png";
        const newName = `${crypto.randomUUID()}.${fileExt}`;

        urls.push(`${ACCESS_PATH}${newName}`);

        await minioClient.putObject(BUCKET_NAME, newName, file.data);
    }

    return { data: urls };
});
