import {ResponseData} from "../types/Respon";


type ResponseDataItem = {
    quality: string;
    link: string;
};

type IGResponseData = {
    success: boolean;
    message: string | null;
    src_url: string;
    title: string;
    picture: string;
    links: ResponseDataItem[];
    images: any[];
    timeTaken: string;
    r_id: string;
};

// function

const IGDownload = async (url:string): Promise<IGResponseData> => {
    const myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "29b228e84amsh27a3561ae107732p14b690jsn3c3b672defbd");
    myHeaders.append("X-RapidAPI-Host", "social-media-video-downloader.p.rapidapi.com");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const result = await fetch("https://social-media-video-downloader.p.rapidapi.com/smvd/get/all?url="+url+"&filename=download", requestOptions);
    const data: IGResponseData = await result.json();

    return data;
}

function formatResponse(data: IGResponseData): ResponseData {
    if (!data.success) {
        return {
            success: false,
            message: data.message,
            links: []
        }
    }

    const formattedLinks = data.links.map(link => {
        let quality = link.quality.replace('render_', '')
            .replace('hd_', '')
            .replace('sd_', '').replace("_0", "")

        // hilangkan array yang qualitynya sama dengan "0"



        return {
            quality: quality,
            link: link.link
        };

    // gunakan reduce untuk menghilangkan duplikat kualitas

    }).filter(link => link.quality !== "0").sort((a, b) => {
        if (a.quality === "audio") return -1;
        if (b.quality === "audio") return 1;
        return parseInt(b.quality) - parseInt(a.quality);
    }).reduce((unique: ResponseDataItem[], item: ResponseDataItem) => {
        return unique.findIndex(link => link.quality === item.quality) < 0
            ? [...unique, item]
            : unique;
    }, []);

    return {
        success: true,
        message: null,
        links: formattedLinks
    };
}


// download video from instagram and terformat
const downloadIG = async (url: string): Promise<ResponseData> => {
    const data = await IGDownload(url);
    return formatResponse(data);
}


export  {
    downloadIG,
    formatResponse
}