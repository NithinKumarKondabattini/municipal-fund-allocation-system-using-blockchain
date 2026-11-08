import {createClient} from '@supabase/supabase-js';

const url=process.env.SUPABASE_URL;
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket=process.env.SUPABASE_STORAGE_BUCKET||'municipal-documents';
const client=url&&key?createClient(url,key,{auth:{persistSession:false}}):null;
const safeName=name=>String(name||'document').replace(/[^a-zA-Z0-9._-]/g,'_');

export const supabaseConfigured=Boolean(client);

export async function mirrorDocument({documentId,fileName,buffer,mimeType,fileHash,fileSize,projectId}){
  if(!client)return {provider:'LOCAL',storageKey:null,publicUrl:null};
  const storageKey=`documents/${documentId}/${safeName(fileName)}`;
  const {error:storageError}=await client.storage.from(bucket).upload(storageKey,buffer,{contentType:mimeType||'application/octet-stream',upsert:true});
  if(storageError)throw storageError;
  const {data:publicData}=client.storage.from(bucket).getPublicUrl(storageKey);
  // This metadata mirror is optional. Create the table from docs/supabase.sql to enable it.
  const {error:metadataError}=await client.from('municipal_documents').upsert({id:documentId,file_name:fileName,file_hash:fileHash,file_size:fileSize,mime_type:mimeType,storage_key:storageKey,project_id:projectId||null,updated_at:new Date().toISOString()});
  if(metadataError&&process.env.SUPABASE_SYNC_DOCUMENTS==='true')throw metadataError;
  return {provider:'SUPABASE',storageKey,publicUrl:publicData?.publicUrl||null};
}
