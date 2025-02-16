import axios from 'axios'
import { Shortend, ShortenRequest } from '../models/models';

const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL
});

const getHeaders = (userId: string) => {
    return {
        headers: {
            "user-id": userId
        }
    }
}

export const fetchUploads = async (userId: string) => {
    const headers = getHeaders(userId)
    return AxiosInstance.get<Shortend[]>('/uploads', headers)
}

export const shortenUrl = async (userId: string, url: string) => {
    const headers = getHeaders(userId)
    const body: ShortenRequest = {url: url}
    return AxiosInstance.post<Shortend>('/shorten',body, headers)
}

export const uploadFile = async (userId: string, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const headers = {...getHeaders(userId), 'Content-Type': 'multipart/form-data'}
    return AxiosInstance.post<Shortend>('/upload', formData, headers)
}