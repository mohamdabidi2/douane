export const getFileExtension = (url) => {
    const parts = url.split('.');
    return parts[parts.length - 1];
  };
  
  export const getMimeType = (extension) => {
    const mimeTypes = {
      'pdf': 'application/pdf',
      'jpeg': 'image/jpeg',
      'jpg': 'image/jpeg',
      'png': 'image/png',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  };
  
  export const getFileName = (url) => {
    const parts = url.split(/[/\\]/);
    return parts[parts.length - 1];
  };
  