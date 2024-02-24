import { BASE_URL } from "../../config/constants";

const CoverArtInput = ({onChange, fileName, cover_art_url, uploadPreview}) => {
    return (
      <div className="flex flex-col">
          <div className="flex flex-col md:flex-row justify-between">
              <div className='flex flex-col'>
                  <p
                  className="mb-4 text-md sm:text-lg">
                      Cover Art
                  </p>
                  <input
                  type='file'
                  id='cover_art'
                  className="mb-4 absolute w-0 h-0 opacity-0"
                  onChange={onChange}
                  />
                  <label className="text-lg cursor-pointer font-medium flex items-center justify-center relative bg-blue-200 py-3 px-8 rounded-md shadow-md" 
                  htmlFor="cover_art">
                      Select File
                  </label>
                  <p className="text-md py-4">{fileName}</p>
              </div>
              <div className="max-w-32 mb-4">  
              {cover_art_url && !uploadPreview &&
                  <>
                      <p className="mb-2">Preview:</p>
                      <img src={`${BASE_URL}/${cover_art_url}`} alt="preview of cover art"/>
                  </>
              }
              {uploadPreview && 
                  <>
                      <p>Preview:</p>
                      <img src={uploadPreview} alt="preview of cover art"/>
                  </>
              }
              </div>
          </div>
      </div>
    )
  }
  
  export default CoverArtInput;