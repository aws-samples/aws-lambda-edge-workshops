document.getElementById("like").addEventListener("click", (e) => {
    const cardId = document.getElementById("like").getAttribute("data-cardid");
    const req = new XMLHttpRequest();
    const o = e.srcElement || e.target;
    req.open("POST", "/api/like?id=" + cardId);
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                const res = JSON.parse(req.responseText);
                document.getElementById("likes").innerHTML = res.Likes;
                o.firstChild.data = "Done! :)";
            } else {
                o.firstChild.data = "Error! :(";
            }
        }
    }
    req.send();
    o.disabled = true;
    o.firstChild.data = "Wait...";
});
