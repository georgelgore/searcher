document.addEventListener('DOMContentLoaded', () => {
 const MAINDIV = document.querySelector("div.main")
 // Using data-value attribute to make selecting elements uniform
 MAINDIV.addEventListener('click', e => {
   e.preventDefault()
   console.log(e.target)
   const clicked = e.target.dataset.value
   switch (clicked) {
     case "username-button":
       EventHandler.userExists().then(boolean =>{
         if(boolean === true){
             EventHandler.getExistingUser().then(obj => {
               obj.render()
             });
         } else {
             EventHandler.createNewUser().then(obj => {
               obj.render()
             });
         }
       })

       break;
     case "search-button":
       const searchInput = document.querySelector("input[data-value='search-input']")
       if (searchInput) {
         GoogleHandler.makeGoogleRequest(searchInput.value)
         StackXAdapter.getStackDataAPI(searchInput.value).then(response => StackHandler.showResponses(response, searchInput.value))
         WikipediaAdapter.getWikiDataAPI(searchInput.value).then(wikiResults => WikipediaHandler.showResponses(wikiResults, searchInput.value))

       }
       break;

      case "view-topic-button":
        const articleBox = document.getElementById("article-box")
        let allArticles = Article.all.filter(article =>{
          return article.topicId === parseInt(e.target.dataset.topicId)
        })
        allArticles.forEach(article =>{
          let newDiv = document.createElement("div")
          newDiv.innerHTML += `<a href=${article.link}>${article.title}</a><br>`
          newDiv.innerHTML += `<p>${article.description}</p>`
          newDiv.innerHTML += `<button data-value="delete-article-button" data-id=${article.id} type="button">Delete</button>`
          articleBox.append(newDiv)
        })
      break;

      case "delete-article-button":
        // debugger
        EventHandler.deleteArticle(parseInt(e.target.dataset.id)).then(resp => {
          e.target.parentNode.outerHTML = ''
          Article.all.filter(article => {
            article.id !== parseInt(e.target.dataset.id)
          })
        })
      break;

     case "add-article-button":
       const topicTitle = e.target.parentNode.getAttribute("data-topic-title");
       const articleDescription = e.target.parentNode.getAttribute("data-article-description")
       const articleLink = e.target.parentNode.getAttribute("data-article-link")
       const articleTitle = e.target.parentNode.getAttribute("data-article-title")

      //  console.log(articleTitle)

       const topic = {user_id: User.all[0].id, title: topicTitle.charAt(0).toUpperCase() + topicTitle.slice(1)}

       EventHandler.topicExists(topic).then(boolean =>{
         if(boolean){
           const topicId = EventHandler.getExistingTopic(topic.title).id
          //  console.log(topicId)
           const article = {topic_id: topicId, title: articleTitle, url: articleLink, description: articleDescription}
           EventHandler.articleExists(article).then(boolean =>{
             if (boolean) {
             }else {
               EventHandler.createNewArticle(article)
             }
           })
         } else {
           EventHandler.createNewTopic(topic).then(top => {
             const topicId = EventHandler.getExistingTopic(topic.title).id
             const article = {topic_id: topicId, title: articleTitle, url: articleLink, description: articleDescription}
             EventHandler.createNewArticle(article)
             console.log(Topic.all)
             console.log(Article.all)
             Topic.render()
           })
         }
       })
       console.log(Topic.all)
       console.log(Article.all)
       break;

   }
 })

})
