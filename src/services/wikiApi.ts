import axios from 'axios';

export interface WikiArticle {
    id: number;
    title: string;
    extract: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
    content_urls: {
        desktop: {
            page: string;
        };
        mobile: {
            page: string;
        };
    };
    lang: 'ko' | 'en';
}

export const fetchRandomArticle = async (lang: 'ko' | 'en' = 'ko'): Promise<WikiArticle> => {
    try {
        const url = `https://${lang}.wikipedia.org/api/rest_v1/page/random/summary`;
        const response = await axios.get(url);
        // Add lang to the object since API doesn't return it explicitly in the body for the article itself usually, 
        // but useful for context.
        return { ...response.data, lang };
    } catch (error) {
        console.error("Error fetching article:", error);
        throw error;
    }
};
