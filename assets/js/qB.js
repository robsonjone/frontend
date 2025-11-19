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
let currentField = "";

let isOneField = false;
let isOneTable = false;

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
    
    allFields.map((field) => {
        addOneFieldToList(table,field)
    })
    currentElementDragged = addAllFieldsFromTableToContent(allFields);

}

/**
 * * Add ALL SELECTED Fields to array list into query Object
 */
function addAllSelectedFieldsToList(){
    
    let table = currentTable
    
    //console.log(table)
    let fieldsOfTable = Array.from(document.querySelectorAll(".datalist[rel="+currentTable+"] .itemsDataList input[type=checkbox]:checked"))
    let queryEditor = document.querySelector("#queryEditor")
    fieldsOfTable.map((field) => {
        addOneFieldToList(table,field.parentNode.innerText);
        queryEditor.appendChild(createElementScreen(field.parentNode.innerText))
    })
}

/**
 * * Add ONE Field to content into screen 
 */
function addOneFieldToContent(field){
    createElementScreen(field)
}

/**
 * * Add ALL Field to content on the screen 
 */
function addAllFieldsFromTableToContent(allFields){

    const element = []
    allFields.map((field) => element.push(createElementScreen(field)))

    return element

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
            
            isOneTable = true;
            isOneField = false;

            //addAllFieldsFromTableToList(currentTable)

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
               
                isOneTable = false;
                isOneField = true;
                
                currentTable = list.attributes.rel.value
                currentField = field
                currentElementDragged = createElementScreen(field)
                //addOneFieldToList(currentTable,field)
    
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

    const agregFunctions = [
        {value:"mix",label:"Mínimo"},
        {value:"max",label:"Máximo"},
        {value:"avg",label:"Médio"},
        {value:"count",label:"Contar"},
        {value:"sum",label:"Somar"},
    ]
    select.insertAdjacentElement("beforeend",option)

    agregFunctions.map((func) => {
        let opt = option.cloneNode(true)
        opt.setAttribute("value",func.value)
        opt.innerText = func.label
        select.insertAdjacentElement("beforeend",opt)
    })


    root.insertAdjacentElement("beforeend",select)

    const toolbar = document.createElement("div");
    toolbar.classList.add("actions")

    const icon = document.createElement("i")
    icon.classList.add("material-symbols-outlined","close");
    icon.innerText = "close_small";
    icon.addEventListener("click",(event) =>{
        toolbar.parentNode.remove()
    })

    toolbar.appendChild(icon)

    root.insertAdjacentElement("beforeend",toolbar);
    return root;
}

/**
 * Add drop Listener to Content
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

        if(isOneTable){
            addAllFieldsFromTableToList(currentTable)
            currentElementDragged.map((element) => 
                event.target.appendChild(element)
            )
        }

        if(isOneField){
            addOneFieldToList(currentTable,currentField)
            event.target.appendChild(currentElementDragged);
        }

        console.log(currentTable)
        console.log(currentElementDragged)
        qe.classList.remove('highlight'); 
    });
});

/**
 * Add listener to add selected fields
 */
const addfield = Array.from(document.querySelectorAll('.addField'));

addfield.map((add)=>{
    add.addEventListener('click',function(){
        //const fieldsSelected = Array.from(document.querySelectorAll(".itemsDataList > input[type='checkbox']:checked"));
        //console.log(fieldsSelected[0].parentElement);
        let table = add.parentElement.parentElement.attributes.rel.value;
        currentTable = table
        addAllSelectedFieldsToList();
    })
})

/*
    Build query from Object
*/

function createQUERY(){
    let k = Object.keys(queryToBuild)
    let fieldsSelected = []
    let doubleFields = []
    let q = "select "
    let field = ""

    k.map((key,pos) =>{
        console.log(queryToBuild[key])
        queryToBuild[key].map((field) =>{
            if(fieldsSelected.includes(field)) {
                doubleFields.push(field)
            }
            fieldsSelected.push(field)
        })

    })

    let allFields = []
    k.map((key,pos) =>{
        queryToBuild[key].map((field) =>{
            if(doubleFields.includes(field)) {
                 field = key+"."+field
            }
            allFields.push(field)
        })

    })

    console.log("Double Fields: ",allFields)
    q += allFields.join(",")  
    q += " from "+k.join(',')

    console.log(queryToBuild)
    console.log(q)
}

/*
    Build query from input
*/
function createSQL(){
    let fields = Array.from(document.querySelectorAll("#queryEditor > .selectFields:not(:first-child)"));
    let query = "select ";
    let select = [];
    let from = [];
    let where = [];
    let groupBy = [];
    let hasAgreg = false;

    fields.map((field) =>{
        let column = field.children[0].innerText 
        let alias = field.children[1].value
        let agreg = field.children[2].value

        console.log("Agregacao: ",agreg);
        
        if(agreg !==""){
            column = agreg+`(${column})`
            hasAgreg = true;
        }else{
            if(hasAgreg)
                groupBy.push(column);
        }
        if (alias !== "")
            column += " as "+alias
        select.push(column)
    })

    console.log("select "+select.join(',')," From ",sql.table.join(',')," group by ",groupBy.join(','));
    if(select.length > 0)
        query += select.join(',')
    
    query = query.replaceAll(",",",\n\t")
    
    if(sql.table.length > 0)
        query += " from "+sql.table.join(',')

    query = query.replace("from","\nfrom");

    if(sql.table.length > 1){
        let where = "\nwhere "
        let hasFks = false;
        
        if(sql.table.length > 1) hasFks = true;

        sql.table.map((table,pos) =>{
            let foreignKeys  = allTables[table].fk;

            foreignKeys.map((foreignKey,index)=>{
                console.log("Index FK: ", "Table:",pos ," ",sql.table.length, "FK:",index," ",foreignKeys.length);
                let filter = ""
                if(foreignKey){
                    filter = foreignKey.table+".id = "+table+"."+foreignKey.field+" \n";
                }
                if(hasFks && pos < sql.table.length){
                    if(index < foreignKeys.length )
                        filter = " and "+filter
                }
                
                where += filter;
                hasFks = true;

            })
            console.log("FK:",allTables[table].fk)

        })

        query += where +"\n";
        
    }


    
    if(groupBy.length > 0)
        query += " group by "+groupBy.join(',')
    
        query = query.replace("group by","\ngroup by");

    console.log("query: ",query)

    const output = document.querySelector(".scriptOutput");
    output.innerHTML = `<pre>${query}</pre>`;
}