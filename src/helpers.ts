import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config/firebase";

export const uploadFile = async (file: File | Blob, filePath: string): Promise<string | null> => {
  if (!file) return null;
  let path = filePath + Date.now();
  if (file.constructor === Blob) path += '.webm';
  const imagesFolderRef = ref(storage, path);
  try {
    const snapshot = await uploadBytes(imagesFolderRef, file);
    const uploadedFileUrl = await getDownloadURL(snapshot.ref);
    return uploadedFileUrl;
  } catch (err) {
    console.error(err);
    return null;
  }

}


export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
};


const calculateTimeDifference = (time: number) => {
  const units = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (const { label, seconds } of units) {
    const interval = Math.floor(time / seconds);
    if (interval >= 1) {
      return {
        interval: interval,
        unit: label
      };
    }
  }
  return {
    interval: 0,
    unit: ''
  };
};


export const timeAgo = (date: string | number | Date) => {
  const time = Math.floor(
    (new Date().valueOf() - new Date(date).valueOf()) / 1000
  );
  const { interval, unit } = calculateTimeDifference(time);
  const suffix = interval === 1 ? '' : 's';
  return `${interval} ${unit}${suffix} ago`;
};