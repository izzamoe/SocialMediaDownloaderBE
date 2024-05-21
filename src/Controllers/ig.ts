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
    myHeaders.append("X-RapidAPI-Key", "824dddee65msh76dbe040b14bfe4p12ab6ajsnc6532155d4f8");
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
        let quality = link.quality.replace('render_', 'resolusi ')
            .replace('hd_', 'resolusi ')
            .replace('sd_', 'resolusi ');

        return {
            quality: quality,
            link: link.link
        };
    });

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