type ListQuality = {
    quality: string,
    link: string
}

// ResponseData
type ResponseData = {
    success: boolean;
    message: string | null;
    links: ListQuality[];
}

export {
    ResponseData
}