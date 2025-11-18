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

createTableList();

addOneFieldToList('pessoa','nome_da_pessoa');
addOneFieldToList('pessoa','nasc_da_pessoa');
addAllFieldsFromTableToList('pessoa');

addAllSelectedFieldsToList()

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
           
            let currentTable = table.parentNode.attributes.rel.value
            addAllFieldsFromTableToList(currentTable)

            let currentElementDragged = "" //addAllFieldsTable(event)
        });
        
        const icon = document.createElement("i");
        icon.classList.add("material-symbols-outlined");
        icon.innerText = "database_search";

        let iconInsert = icon.cloneNode(true);
        iconInsert.innerText = "move_item";
        iconInsert.classList.add("addField");

        table.insertAdjacentElement("afterbegin",icon);
        
        list.appendChild(table);
        
        const itemElement = document.createElement('li');
        itemElement.classList.add("itemsDataList");
        itemElement['draggable'] = true;
        itemElement.addEventListener('dragstart', (event) => {               

            event.dataTransfer.setData('text/html', event.target.nextElementSibling);
           
            let currentElementDragged = table.parentNode.attributes.rel.value
            addOneFieldToList(currentTable,currentElementDragged)

            //let currentElementDragged = "" //addAllFieldsTable(event)
        });
        
        let itemAction = itemElement.cloneNode(true);
        itemAction.classList.add("table");
        itemAction.insertAdjacentElement("beforeend",iconInsert);
        
        let fields = Object.keys(allTables[tb]).filter((f)=>{
            return f !== "fk" && f !== "pk"
        })
        fields.map((field) => {
            let item = itemElement.cloneNode(true);
            let checkbox = document.createElement('input');  
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

function createElementScreen(){

}

