
// {
//     id: 3657848524,
//     title: 'Harry Potter and the Philosopher\'s Stone',
//     author: 'J.K Rowling',
//     year: 1997,
//     isComplete: false,
//   }
const booksComplete = [];
const booksUncomplete = [];
const dataBooks = [];
const BOOKS_JEY = 'books-key';
const RENDER_EVENT = 'render-event';
const SAVE_EVENT = 'save-event';
const submitFrom = document.getElementById("inputBook")



document.addEventListener('DOMContentLoaded', function(){
    // submit form 
    submitFrom.addEventListener('submit', function(e) {
        e.preventDefault();
        addBooks();
     
    })
    if(isStorage()){
        loadDataFromStorage()
    }
})

    // menambahkan object ke variabel dataBooks
    function addBooks(){
        const titleBook = document.getElementById('inputBookTitle').value
        const bookId = generateId();
        const authorBook = document.getElementById('inputBookAuthor').value;
        const yearBook = document.getElementById('inputBookYear').value;
        const isComplete = document.getElementById('inputBookIsComplete').checked;
    
        const todoObject = objectBooks(bookId,titleBook,authorBook,yearBook,isComplete)
        if(isComplete){ 
            booksComplete.push(todoObject)
            console.log(booksComplete)
        }
        else{
            booksUncomplete.push(todoObject)
            console.log(booksUncomplete)
        }
        
        dataBooks.push(todoObject)

        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }
    

    // membuat kode unik / id unik
    function generateId(){
        return +new Date()
    }


    // fungsi membuat object
    function objectBooks(id,title,author,year,isComplete){
        return{
            id : id,
            title:title,
            author:author,
            year: parseInt(year),
            isComplete : isComplete,
        }
    }



    // merender element ke dalam rak book
    // function renderBooks(){
    //     const booksCompleteList = document.getElementById('completeBookshelfList')
    //     const booksUncompleteList = document.getElementById('incompleteBookshelfList')
    //     booksCompleteList.innerHTML = '';
    //     booksUncompleteList.innerHTML = '';
    //     const chekbox = document.querySelector('#inputBookIsComplete')

    //     const bookToDisplay = chekbox.checked ? booksComplete : booksUncomplete;

    //     for(const bookItem of bookToDisplay){
    //         const bookElement = makeTodo(bookItem)
    //         if(bookItem.isComplete){
    //             booksCompleteList.append(bookElement)
    //         }
    //         else{
    //             booksUncompleteList.append(bookElement)
    //         }
    //     }
    //     document.dispatchEvent(new Event(RENDER_EVENT))
    //     saveData()
    // }


    //membuat element penampung book
    function makeTodo(todoObject){
        const Article = document.createElement('article')
        Article.classList.add('book_item')
        Article.setAttribute('id',`todo-${todoObject.id}`)
        const bookTitle = document.createElement('h3')
        bookTitle.innerText = todoObject.title;

        const penulis = document.createElement('p')
        penulis.innerText =`penulis : ${todoObject.author}`;

        const tahun = document.createElement('p')
        tahun.innerText = `tahun : ${todoObject.year}`;

        Article.append(bookTitle,penulis,tahun)
        const div = document.createElement('div')
        div.classList.add('action')

        const button1 = document.createElement('button')
        button1.classList.add('green')
        
        const button2 = document.createElement('button')
        button2.classList.add('red')
        
        div.append(button1,button2)

        if(todoObject.isComplete){
            button1.innerText = 'Belum selesai di baca';
            button1.addEventListener('click',() => {
                addTaskFromComplete(todoObject.id)
            })
            
            button2.innerText = 'Hapus Buku'
            button2.addEventListener('click', () => {
                removeTaskFromComplete(todoObject.id)
            })
        }
        else{
            button1.innerText = 'Selesai di baca';
            button1.addEventListener('click',() => {
                undoTaskFromComplete(todoObject.id)
            })

            
            button2.innerText = 'Hapus Buku'
            button2.addEventListener('click', () => {
                removeTaskFromComplete(todoObject.id)
            })
        }
        Article.append(div)
        return Article
    }


    //fungsi menambahkan book yang sudah  di baca
    function addTaskFromComplete(id){
        todoTarget = findTodo(id)

        if(todoTarget == null) return;
        todoTarget.isComplete = false
        document.dispatchEvent(new Event(RENDER_EVENT));
        console.log(todoTarget)
        saveData()
    }


    // fungsi mengembalikan book yang "sudah di baca" ke "belum di baca"
    function undoTaskFromComplete(id){
        const todoTarget = findTodo(id)

        if(todoTarget == null) return 
        todoTarget.isComplete = !todoTarget.isComplete;

        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }


    //fungsi menemukan id yang cocok dengan id yang ditunjuk
    function findTodo(id){
        for(const todo of dataBooks){
            if(todo.id == id){
                return todo
            }
        }
        return null
    }
  

    //fungsi menghapus book 
    function removeTaskFromComplete(id){
        const todoIndex = findIndex(id, dataBooks);
        console.log(todoIndex)
    
        if(todoIndex === -1) return ;
    
        const isComplete = dataBooks[todoIndex].isComplete;
    
        // Hapus dari array yang sesuai
        if (isComplete) {
            const completeIndex = findIndex(id, booksComplete);
            if (completeIndex !== -1) {
                booksComplete.splice(completeIndex, 1);
            }
        } else {
            const uncompleteIndex = findIndex(id, booksUncomplete);
            if (uncompleteIndex !== -1) {
                booksUncomplete.splice(uncompleteIndex, 1);
            }
        }
    
        // Hapus dari dataBooks
        dataBooks.splice(todoIndex, 1);
    
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData()
    }
    


    // fungsi menemukan index yang id nya  cocok dengan id yang di tunjuk
    function findIndex(id){
        for(const index in dataBooks){
            if(dataBooks[index].id === id){
                return index
            }
        }
        return -1;
    }



    // fungsi mencari book
    function search(){
        let searchTitle = document.getElementById('searchBookTitle').value.toLowerCase(); //book yang di cari user
        const booksAll = document.querySelectorAll('.book_list h3') //  semua book yang ada di rak

        const booksItem = Array.from(booksAll)
        booksItem.map((item) => {
            if(searchTitle !== ''){
                if(searchTitle == item.innerText){
                    item.parentElement.style.display = 'block';
                }
                else{
                    item.parentElement.style.display = 'none'
                }
            }
            else{
                item.parentElement.style.display = 'block'
            }
        })
        
    }

    document.getElementById('searchSubmit').addEventListener('click',(e) => {
        e.preventDefault()
        search()
    })



    // fungsi mengecek apakah localStorage support dalam browser user
    function isStorage(){
        if(typeof (Storage) === undefined){
            alert('Your browser is not support yet')
            return false
        }
        return true
    }



    // menyimpan dataBooks ke dalam localStorage
    function saveData(){
        if(isStorage){
            const parse = JSON.stringify(dataBooks)
            localStorage.setItem(BOOKS_JEY,parse)

            document.dispatchEvent(new Event(SAVE_EVENT))
        }

    }



    //menyimpan dataBooks yang di ambil dari penyimpanan localStorage
    function loadDataFromStorage(){
        const inisializeData = localStorage.getItem(BOOKS_JEY)
        let data = JSON.parse(inisializeData)

        if(data !== null){
            for(todo of data){
                dataBooks.push(todo)
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT))
    }



    // event untuk fungsi yang ke triger dengan event SAVE_EVENT
    document.addEventListener(SAVE_EVENT,() => {
        alert('berhasil di tambahkan ')
        console.log(dataBooks)
    })

    document.addEventListener(RENDER_EVENT,() => {
        const uncompleteBooksList = document.getElementById('incompleteBookshelfList')
        const completeBooksList = document.getElementById('completeBookshelfList')

        uncompleteBooksList.innerHTML = '';
        completeBooksList.innerHTML = '';

        for(const bookItem of dataBooks){
            const bookElement = makeTodo(bookItem)

            if(bookItem.isComplete){
                completeBooksList.append(bookElement)
            }
            else{
                uncompleteBooksList.append(bookElement)
            }
        }
    })
    to