const buttons = document.querySelectorAll('button[data-url]');
const statusDisplay = document.getElementById('status-display');
const responseBody = document.getElementById('response-body');
buttons.forEach((button) => {
    button.addEventListener('click' , async () => {
        const url = button.dataset.url ; 
        const method = button.dataset.method; 

        statusDisplay.textContent = "loading...";
        responseBody.textContent = '';

        try{
            const response = await fetch(url , {method});

            statusDisplay.textContent = `${response.status} ${response.statusText}`;
            const rawText = await response.text();

            try{
                const jsonData=JSON.parse(rawText);
                responseBody.textContent = JSON.stringify(jsonData , null , 2);
            }catch{
                responseBody.textContent = rawText;
            }
        } catch (error) {
            statusDisplay.textContent = 'Network Error';
      responseBody.textContent = `Could not reach server: ${error.message}`;
        }
        
    });
});