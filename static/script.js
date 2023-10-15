const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const loader = document.querySelector(".loader");
const loaderContainer = document.querySelector(".loader-container");
const loaderText = document.querySelector(".loader-text");
const waitingTime = 30000;

let food_dict = {}
// Event listeners
searchBtn.addEventListener('click', searchActivated);

console.log("JS working");
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Get meal list that matches with the ingredients
function searchActivated(){
    function getMealListPromise(){
        console.log("getMealListPromise activated");
        return new Promise((resolve, reject) => {
            let searchInputTxt = document.getElementById('search-input').value.trim();
            //send user input to python backend
            loader.style.visibility = 'visible';
            loaderContainer.style.display = 'flex';
            loaderText.style.visibility = 'visible';
    
            $.ajax({ 
                url: '/process', 
                type: 'POST', 
                data: JSON.stringify({'data': searchInputTxt }),
                dataType: "json",
                contentType: 'application/json',
                success: function(response) { 
                    console.log("ajax successful", searchInputTxt);
    
                }, 
                error: function(error) {
                    console.log("error"); 
                    console.log(error); 
                },
                
                })
                .done(function(data) {
                    food_dict = data['result'];
                    console.log(food_dict);
                    resolve();
    
            }); 
        });
    
    };
    
    getMealListPromise().then(() => {
        let html = "";
        console.log("first part of promise.then");
            
            for (const key in food_dict) {
                html += `
                <div class="meal-item" id="${key}"">
                    <div class="meal-img">
                        <img src="../static/images/sample_food.jpg" alt="food">
                    </div>
                    <div class="meal-name">
                        <h3>${key}</h3>
                        <button class="recipe-btn">Get Recipe</button>
                    </div>
                </div>`;
            };
            displayResultText = document.querySelector('#display-result');
            displayResultText.style.display = 'block';
    
    
            html += `
            <div id="myModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Modal Title</h2>
                    <p></p>
                </div>
            </div>`
            mealList.innerHTML = html;
            console.log("html added");
            const modal = document.getElementById('myModal');
            const closeBtn = document.querySelector('.close');
    
    
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            // Close the modal if the user clicks outside of it
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
    
    
            let recipe_buttons = document.querySelectorAll('.recipe-btn');
            loader.style.visibility = 'hidden';
            loaderContainer.style.display= 'none';
            loaderText.style.visibility = 'hidden';
            recipe_buttons.forEach((button) => {
            button.addEventListener('click', () => {
                modal.style.display = 'block';
                const mealName = button.parentElement.parentElement.querySelector('.meal-name h3').innerHTML;
                console.log(mealName);
                let modal_heading = document.querySelector(".modal-content h2");
                let modal_p = document.querySelector(".modal-content p");
                modal_heading.innerHTML = mealName;
                modal_p.innerHTML = "";
                modal_p.innerHTML += "<ul class='ingredient-ul'>";
                
                
                console.log(food_dict[mealName]);
                food_dict[mealName].forEach((ingredient) => {
                    
                    modal_p.innerHTML += `
                    <li>
                        <a target="_blank" href="https://www.walmart.com/search?q=${ingredient.replace(/\s/g, '')}">${ingredient}</a></li>`;
                    
                });
                modal_p.innerHTML += "</ul>";
    
            })});
    });
};




    


