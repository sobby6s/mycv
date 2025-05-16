

let dataview = $('#dataview');
function getData(gitHubUser) {
    let rezultat = new Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            // url: `https://api.github.com/users/${gitHubUser}/repos`,
            url: `https://api.github.com/users/${gitHubUser}/repos?per_page=6&page=1&sort=updated`,
            // headers: { "Access-Control-Allow-Origin": "*" },
            dataType: 'json',
            contentType: 'application/json',

        }).done(function (data) {
            if (data.length > 0) {
                // get languages
                // for (const item of repos) {
                //    
                //     const languages = getLanguages(item.owner.login, item.name);
                //     const languagesList = Object.keys(languages).join(", ");

                //     console.log(languagesList);
                // }


                resolve(data);
            }
            else {
                reject('Error, nu s-au primit date!');
            }

        }).fail(function (status, errorThrown) {
            reject('Error: a aparut o eroare ' + JSON.stringify(status) + JSON.stringify(errorThrown))

        }).always(function () {
            console.log('Cererea a fost tratata complet.')
        });
    });
    return rezultat;
}
async function getLanguages(owner, repo) {
    const url = `https://api.github.com/repos/${owner}/${repo}/languages`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(`Error fetching languages for ${repo}:`, error);
        return "Error loading languages";
    }
    finally {
        console.log('Cererea languages a fost tratata complet.')
    }
}


function showData(repos) {
    //const posts = JSON.parse(data);
    let allRepo = '';
    repos.forEach(item => {
        // topics
        const topics = item.topics.length
            ? item.topics.map(topic => `<span class="text-muted">${topic}</span>`).join("  ")
            : "<span class='text-muted'>No topics</span>";
        // format data
        const date = new Date(item.updated_at);
        const formattedDate = new Intl.DateTimeFormat('ro-RO').format(date);

        allRepo += `
        <div class="col-md-4">
                <div class="service-box">
                    <div class="service-ico">
                        <a href='${item.html_url}' target='_blank'>
                            <img style="max-width:300px" src ="https://raw.githubusercontent.com/${item.owner.login}/${item.name}/${item.default_branch}/banner.png">
                        </a>
                    </div>
                    <div class="service-content">
                        <h2 class="s-title"><a href='${item.html_url}' target='_blank'>${item.name}</a></h2>
                        <p class="s-description text-center">
                        ${item.description}
                        </p>
                        <span> Updated at: ${formattedDate}</span> <br>
                        <span> Programming Language: ${item.language}</span> 
                        <div class="card-footer bg-transparent border-success text-start">Topics: ${topics}</div> 
                    </div>
                </div>
            </div>`
    });
    dataview.append(allRepo);
};

$(function () {
    console.log("ready!");
    getData('aadiaconitei').then((myRepos) => {
        showData(myRepos);
        console.log('succes ', myRepos);
    }).catch((err) => {
        console.log('Promisiune nu s-a realizat', err);
    })
});