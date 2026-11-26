document.addEventListener("DOMContentLoaded", function() {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-cards");

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", ${progressDegree}%);
        label.innerHTML = ${solved}/${total}<br><span style="font-size:0.75rem; font-weight:normal; opacity:0.8;">${circle.classList[0].split('-')[0]}</span>;
    }

    function validateUsername(username) {
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching....";
            searchButton.disabled = true;

            const response = await fetch(https://leetcode-api-faisalshohag.vercel.app/${username});

            if (!response.ok) {
                throw new Error("Unable to fetch the user details");
            }

            const parsedData = await response.json(); 
            console.log("Logging data: ", parsedData);

            const totalEasyQues = parsedData.totalEasy || 0;
            const totalMediumQues = parsedData.totalMedium || 0;
            const totalHardQues = parsedData.totalHard || 0;

            const solvedTotalEasyQues = parsedData.easySolved || 0;
            const solvedTotalMediumQues = parsedData.mediumSolved || 0;
            const solvedTotalHardQues = parsedData.hardSolved || 0;

            updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
            updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
            updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

            const submissions = parsedData.totalSubmissions || [];
            
            const totalSub = submissions.find(sub => sub.difficulty === "All")?.submissions || 0;
            const easySub = submissions.find(sub => sub.difficulty === "Easy")?.submissions || 0;
            const mediumSub = submissions.find(sub => sub.difficulty === "Medium")?.submissions || 0;
            const hardSub = submissions.find(sub => sub.difficulty === "Hard")?.submissions || 0;

            const cardsData = [
                { label: "Overall Submissions", value: totalSub },
                { label: "Overall Easy Submissions", value: easySub },
                { label: "Overall Medium Submissions", value: mediumSub },
                { label: "Overall Hard Submissions", value: hardSub }
            ];

            if (cardStatsContainer) {
                cardStatsContainer.innerHTML = cardsData.map(data => {
                    return `
                        <div class="card">
                            <h3>${data.label}</h3>
                            <p>${data.value}</p>
                        </div>
                    `;
                }).join("");
            }

        } catch (error) {
            console.error("The exact error is:", error);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    searchButton.addEventListener('click', function() {
        const username = usernameInput.value;
        if(validateUsername(username)) {
            fetchUserDetails(username);
        }
    });

});