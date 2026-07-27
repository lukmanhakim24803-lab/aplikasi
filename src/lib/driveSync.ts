import { PembiayaanItem } from '../types';

export interface BmtDatabaseSchema {
  version: string;
  lastUpdated: string;
  cabang: string;
  pembiayaan: PembiayaanItem[];
}

const FILE_NAME = 'bmt_ugt_pasirian_database.json';

/**
 * Searches Google Drive for existing database file
 */
export async function findDriveDatabaseFileId(accessToken: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`name = '${FILE_NAME}' and trashed = false`);
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id, name, modifiedTime)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Error finding Drive file:', await response.text());
      return null;
    }

    const data = await response.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  } catch (error) {
    console.error('Failed to search Drive:', error);
    return null;
  }
}

/**
 * Loads database content from Google Drive file
 */
export async function loadFromGoogleDrive(accessToken: string): Promise<BmtDatabaseSchema | null> {
  try {
    const fileId = await findDriveDatabaseFileId(accessToken);
    if (!fileId) return null;

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Error downloading file from Drive:', await response.text());
      return null;
    }

    const dbData: BmtDatabaseSchema = await response.json();
    return dbData;
  } catch (error) {
    console.error('Failed to load from Google Drive:', error);
    return null;
  }
}

/**
 * Saves or updates database in Google Drive
 */
export async function saveToGoogleDrive(
  accessToken: string,
  pembiayaanList: PembiayaanItem[]
): Promise<{ fileId: string; modifiedTime: string } | null> {
  try {
    const existingFileId = await findDriveDatabaseFileId(accessToken);
    
    const dbContent: BmtDatabaseSchema = {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      cabang: 'Cabang Pasirian',
      pembiayaan: pembiayaanList,
    };

    const fileMetadata = {
      name: FILE_NAME,
      mimeType: 'application/json',
    };

    const fileContent = JSON.stringify(dbContent, null, 2);

    if (existingFileId) {
      // Update existing file in Google Drive
      const updateResponse = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: fileContent,
        }
      );

      if (!updateResponse.ok) {
        console.error('Failed to update file in Drive:', await updateResponse.text());
        return null;
      }

      const resData = await updateResponse.json();
      return { fileId: resData.id || existingFileId, modifiedTime: new Date().toLocaleTimeString('id-ID') };
    } else {
      // Create new file in Google Drive using multipart upload
      const boundary = '314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(fileMetadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        fileContent +
        closeDelimiter;

      const createResponse = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (!createResponse.ok) {
        console.error('Failed to create file in Drive:', await createResponse.text());
        return null;
      }

      const resData = await createResponse.json();
      return { fileId: resData.id, modifiedTime: new Date().toLocaleTimeString('id-ID') };
    }
  } catch (error) {
    console.error('Error saving to Google Drive:', error);
    return null;
  }
}
