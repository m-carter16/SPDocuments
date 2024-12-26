export const bytesToSize = (bytes: number, decimals = 2) => {
    if (!Number(bytes)) {
      return '0 Bytes';
    }
  
    const kbToBytes = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
      'Bytes',
      'KB',
      'MB',
      'GB',
      'TB',
      'PB',
      'EB',
      'ZB',
      'YB',
    ];
  
    const index = Math.floor(
      Math.log(bytes) / Math.log(kbToBytes),
    );
  
    return `${parseFloat(
      (bytes / Math.pow(kbToBytes, index)).toFixed(dm),
    )} ${sizes[index]}`;
  }