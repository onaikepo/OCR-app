import logo from './logo.svg';
import { useCallback, useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import './App.css';

function App() {

  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("");

  const worker = createWorker();

  const convertImageToText = useCallback(async () => {
    if (!selectedImage) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const { data } = await worker.recognize(selectedImage);
    setTextResult(data.text);
  }, [worker, selectedImage]);

  useEffect(() => {
    convertImageToText();
  }, [selectedImage, convertImageToText])

  const handleChangeImage = e => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    } else {
      setSelectedImage(null)
      setTextResult("")
    }
  }

  var dateOfBirth = textResult.substring(textResult.indexOf("UNITED KINGDOM"), textResult.indexOf("3 "))
  //var dateOfBirth = textResult.substring(-1, textResult.indexOf("3 "), 9)
  //var dateOfBirth = textResult.split("1", "2", "3", "4", "5", "6")

  return (
    <div className="App">
      <h1>CheckID: A Web App</h1>
      <div className='input-wrapper'>
        <label htmlFor='upload'> Upload Image</label>
        <input type="file" id='upload' accept='image/*' onChange={handleChangeImage} />
      </div>

      <div className='result'>
        {selectedImage && (
          <div className='box-image'>
            <img src={URL.createObjectURL(selectedImage)} alt="thumb" />
          </div>
        )}
        {textResult && (
          <div className='box-p'>
            <p>{textResult}</p>
            <p>Date of birth is: {dateOfBirth}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
