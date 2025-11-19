const allTables={
    pessoa:{
        id:"number",
        nome:"varchar",
        nome_pai:"varchar",
        nome_mae:"varchar",
        dtnascto:"date",
        id_usuario:"number",
        pk:"id",
        fk:[{table:"usuario",field:"id_usuario"}]
    },
    endereco:{
        id:"number",
        id_pessoa:"number",
        tplograd:"varchar",
        dsclograd:"varchar",
        nrlograd:"varchar",
        bairro:"varchar",
        cep:"varchar",
        id_usuario:"number",
        pk:"id",
        fk:[{table:"pessoa",field:"id_pessoa"},{table:"usuario",field:"id_usuario"}]
    },
    usuario :{
        id:"number",
        id_pessoa:"number",
        login:"varchar",
        email:"varchar",
        id_usuario:"number",
        pk:"id",
        fk:[{table:"pessoa",field:"id_pessoa"}]
    }
}

const queryToBuild = {}
let currentElementDragged ;
let currentTable = "";

createTableList();

/*
addOneFieldToList('pessoa','nome_da_pessoa');
addOneFieldToList('pessoa','nasc_da_pessoa');
addAllFieldsFromTableToList('pessoa');

addAllSelectedFieldsToList()

*/
/**
 * Add ONE Field to array list of query Object
 */
function addOneFieldToList(table, field){
    if(!Object.keys(queryToBuild).includes(table))
        queryToBuild[table] = []

    queryToBuild[table] = [...queryToBuild[table], field]

    console.log("Query to Build: ",queryToBuild)

}


/**
 * * Add ALL Fields to array list into query Object
 */
function addAllFieldsFromTableToList(table){
    const allFields = Object.keys(allTables[table]).filter((f)=>{
        return f !== "fk" && f !== "pk"
    })

    console.log(`All Fields from table ${table}:`,allFields)

}

/**
 * * Add ALL SELECTED Fields to array list into query Object
 */
function addAllSelectedFieldsToList(){
    const selectedFields = {'endereco':["id","id_pessoa","nome_rua"]}
    let table = Object.keys(selectedFields)[0]
    
    //console.log(table)
    let fieldsOfTable = selectedFields[table]
    fieldsOfTable.map((field) => {
        addOneFieldToList(table,field);
    })
}

/**
 * * Add ONE Field to content into screen 
 */
function addOneFieldToContent(){

}

/**
 * * Add ALL Field to content on the screen 
 */
function addAllFieldsFromTableToContent(){

}

/**
 * * Add ONE Field to content on the screen 
 */
function addAllSelectedFieldsToContent(){

}

/**
 * Create a list with tables and fields into screen
 */

function createTableList(){
    const tableArray = Object.keys(allTables);
    const pallete = document.querySelector(".pallete");
    
    tableArray.map((tb) => {
        let list = document.createElement("ul");
        list.classList.add("datalist");
        list.setAttribute('rel',tb);
        
        let table = document.createElement("li")
        table.classList.add("itemsDataList","table");
        table.innerText= tb;
        table['draggable'] = true;

        table.addEventListener('dragstart', (event) => {               

            event.dataTransfer.setData('text/html', event.target.nextElementSibling);
           
            currentTable = table.parentNode.attributes.rel.value
            addAllFieldsFromTableToList(currentTable)

            currentElementDragged = "" //addAllFieldsTable(event)
        });
        
        const icon = document.createElement("i");
        icon.classList.add("material-symbols-outlined");
        icon.innerText = "database_search";

        let iconInsert = icon.cloneNode(true);
        iconInsert.innerText = "move_item";
        iconInsert.classList.add("addField");

        table.insertAdjacentElement("afterbegin",icon);
        
        list.appendChild(table);
        
        let itemElement = document.createElement('li');
        itemElement.classList.add("itemsDataList");
        itemElement['draggable'] = true;
        
        
        let itemAction = itemElement.cloneNode(true);
        itemAction.classList.add("table");
        itemAction.insertAdjacentElement("beforeend",iconInsert);
        
        let fields = Object.keys(allTables[tb]).filter((f)=>{
            return f !== "fk" && f !== "pk"
        })
        fields.map((field) => {
            let item = itemElement.cloneNode(true);
            let checkbox = document.createElement('input');  
            item.addEventListener('dragstart', (event) => {               
    
                event.dataTransfer.setData('text/html', event.target.nextElementSibling);
                //console.log("DraggStart: currentTable")
               
                currentTable = list.attributes.rel.value
                currentElementDragged = createElementScreen(field)
                addOneFieldToList(currentTable,field)
    
                //let currentElementDragged = "" //addAllFieldsTable(event)
    
            });
            checkbox['type'] = "checkbox"
            checkbox['name'] = field

            item.innerText = field
            item.insertAdjacentElement("afterbegin",checkbox);

            list.appendChild(item);
        })

        list.appendChild(itemAction)
        pallete.appendChild(list);
    })

}

/**
 * Create new element dropped into screen
 */

function createElementScreen(field){
    const root = document.createElement("div")
    root.classList.add("selectFields","cel-13")

    const label = document.createElement("label")
    label.innerText = field
    root.insertAdjacentElement("beforeend",label)

    const input = document.createElement("input")
    input.setAttribute('name',field)
    root.insertAdjacentElement("beforeend",input)

    const select = document.createElement("select")
    const option = document.createElement("option")

    select.setAttribute("name","function")
    option.setAttribute("value","")
    option.innerText = "Selecione"

    const option2 = option.cloneNode(true)
    option2.setAttribute("value","max")
    option2.innerText = "Maximo"

    select.insertAdjacentElement("beforeend",option)
    select.insertAdjacentElement("beforeend",option2)

    root.insertAdjacentElement("beforeend",select)

    return root;
}

/**
 * Add drop Listener to Content
 */
/**
 * Configure de content to drop all elements dragged
 */

const queryEditor = Array.from(document.querySelectorAll('#queryEditor,#filterQueryEditor'));
console.log("queryEditor:",queryEditor);
queryEditor.map((qe)=>{
    qe.addEventListener('dragover', (event) => {
        event.preventDefault(); // Allow drop
    });

    qe.addEventListener('dragenter', (event) => {
        event.preventDefault(); 
        qe.classList.add('highlight');
    });
    qe.addEventListener('dragleave', () => {
        qe.classList.remove('highlight');
    });

    qe.addEventListener('drop', (event) => {
        event.preventDefault(); // Prevent default drop behavior
        const data = event.dataTransfer.getData('text/html');

        console.log(currentTable)
        if(currentElementDragged){
            event.target.appendChild(currentElementDragged);
        }
        qe.classList.remove('highlight'); 
    });
});