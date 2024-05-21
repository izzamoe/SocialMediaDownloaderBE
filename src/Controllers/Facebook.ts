type ResponseData = {
    quality: string,
    link: string
}
const getListVideo = async (url:string): Promise<ResponseData[]> => {
    const headers = new Headers();
    headers.append('sec-fetch-user', '?1');
    headers.append('sec-ch-ua-mobile', '?0');
    headers.append('sec-fetch-site', 'none');
    headers.append('sec-fetch-dest', 'document');
    headers.append('sec-fetch-mode', 'navigate');
    headers.append('cache-control', 'max-age=0');
    headers.append('authority', 'www.facebook.com');
    headers.append('upgrade-insecure-requests', '1');
    headers.append('accept-language', 'en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6');
    headers.append('sec-ch-ua', '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"');
    headers.append('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36');
    headers.append('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9');


    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const data = await response.text();

    // Mendapatkan tautan SD dan HD
    const sdLink: string = getLink(data, 'browser_native_sd_url');
    const hdLink: string | null = getLink(data, 'browser_native_hd_url');




    return [
        {
            "quality": "SD",
            "link": sdLink
        },
        {
            "quality": "HD",
            "link": hdLink
        }
    ];
}


function cleanStr(str: string): string {
    const tmpStr = `{"text": "${str}"}`;

    return JSON.parse(tmpStr).text;
}

function getLink(curl_content : string, regexPattern : string): string {
    const regex = new RegExp(`${regexPattern}":"([^"]+)"`);
    const match = curl_content.match(regex);

    if (match) {
        return cleanStr(match[1]+ '&dl=1')

    } else {
        return '';
    }
}




export {
    getListVideo,
}