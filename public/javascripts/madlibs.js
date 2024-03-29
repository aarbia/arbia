const FormComponent = () => {
    const [formData, setFormData] = React.useState({ adjective1: '', adjective2: '', adjective3: '', adverb: '', celebrity: '', 
            celebrity2: '', person: '', noun: '', noun2: '', superlativeAdjective: '', });
    const [message, setMessage] = React.useState('');
  
    const sendStuff = async (event) => {
      event.preventDefault(); // prevent form default event which refreshes the page
      try {
        const response = await fetch('/madlibs', {
          method: 'POST',
          headers: {'Content-Type': 'application/json;charset=UTF-8',},
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setMessage(await response.json());  // assuming response is JSON
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
  
    const handleChange = (event) => {
      const { id, value } = event.target;
      setFormData((prevFormData) => {
        // Spread the previous state
        const updatedFormData = { ...prevFormData };
        // Update the property corresponding to the provided id with the new value
        updatedFormData[id] = value;
        return updatedFormData; // Return the updated state
      });
    };
  
    return (
      <div>
        <h1>ELIZABETH THE FIRST</h1>
        <form method="post" onSubmit={sendStuff}>
          <label> Adjective #1: </label>
          <input type="text" id="adjective1" placeholder="Enter Adjective #1" 
                              value={formData.adjective1} onChange={handleChange}></input><br />
          <label> Adjective #2: </label> 
          <input type="text" id="adjective2" placeholder="Enter Adjective #2" 
                              value={formData.adjective2} onChange={handleChange}></input><br />
          <label> Adjective #3: </label>
          <input type="text" id="adjective3" placeholder="Enter Adjective #3" 
                              value={formData.adjective3} onChange={handleChange}></input><br />
          <label> Adverb: </label>
          <input type="text" id="adverb" placeholder="Enter Adverb" 
                              value={formData.adverb} onChange={handleChange}></input><br />
          <label> Celebrity: </label>
          <input type="text" id="celebrity" placeholder="Enter Celebrity" 
                              value={formData.celebrity} onChange={handleChange}></input><br />
          <label> Different Celebrity: </label>
          <input type="text" id="celebrity2" placeholder="Enter Different Celebrity" 
                              value={formData.celebrity2} onChange={handleChange}></input><br />
          <label> Enter Name of Person: </label>
          <input type="text" id="person" placeholder="Enter Name of Person" 
                              value={formData.person} onChange={handleChange}></input><br />
          <label> Enter Noun #1: </label> 
          <input type="text" id="noun1" placeholder="Enter Noun #1" 
                              value={formData.noun1} onChange={handleChange}></input><br />
          <label> Enter Noun #2: </label>
          <input type="text" id="noun2" placeholder="Enter Noun #2" 
                              value={formData.noun2} onChange={handleChange}></input><br />
          <label> Enter Superlative Adjective: </label> 
          <input type="text" id="superlativeAdjective" placeholder="Enter Superlative Adjective" 
                              value={formData.superlativeAdjective} onChange={handleChange}></input><br /><br />
          <input type="submit" value="See the Results!"></input>
        </form>
        {message && (
          <>
          <p>Elizabeth, the Tudor {message.noun1} of England, was probably the </p>
            <p>{message.superlativeAdjective} ruler the British ever had. Elizabeth was the</p>
            <p>daughter of Henry the Eighth and Ane Boleyn. Later, Anne had</p>
            <p>her {message.noun2} chopped off by Henry.</p>
            <p>Elizabeth was born in 1533 and became queen when she was 25. She</p>
            <p>was a {message.adjective1} Protestant and persecuted the {message.adjective2}</p>
            <p>Catholics {message.adverb}. In 1588, the Armada</p>
            <p>attacked England. But the English fleet, commanded by {message.celebrity}</p>
            <p>and {message.celebrity2}, defeated them. Elizabeth ruled for 45 years,</p>
            <p>and during her reign England prospered and produced Shakespeare,</p>
            <p>Francis Bacon, and {message.person}. Elizabeth never married,</p>
            <p>which is why she is sometimes called the {message.adjective3} Queen.</p>
          </>
        )}
      </div>
    );
  };
  
  const form = ReactDOM.createRoot(document.getElementById('madlibs'));
  form.render(<FormComponent />);