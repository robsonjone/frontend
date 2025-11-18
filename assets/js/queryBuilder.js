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

createTableTree();

let elementeSelected = null;
let elementDraged = null;
let currentTable = "";

/**
 * Fields from tables : 
 *      add unique field to content
 */
const tableFields = Array.from(document.querySelectorAll('.datalist > .itemsDataList:not(.table)'));        
const fieldFilter = document.querySelector('.fieldFilter');       

tableFields.map((field)=>{
    field.addEventListener('dragstart', (event) => {
        console.log("Text id:",field.innerText.split("\n")," Class:",field.classList)
        let text = ""
        let txt = field.innerText.split("\n")
        if(txt.length > 1){
            text = " * "
        }else
            text = txt[0]

        event.dataTransfer.setData('text/html', event.target.nextElementSibling);
       /* fieldFilter.firstChild.innerText = event.target.innerText;
        console.log("After: ",fieldFilter.firstChild.innerText);
        elementDraged = fieldFilter.cloneNode(true);*/
        
        //addFieldElement
        currentTable = field.parentElement.attributes.rel.value
        addOneFieldToArray(text,currentTable,true)
        
        elementDraged = addFieldElement(text)
        elementDraged.firstChild.nextSibling.innerText = event.target.innerText;
        console.log("Dragging Not Table: ",elementDraged);
    });
});

/**
 * Add all fields from table to content
 */
const tableAllFields = Array.from(document.querySelectorAll('.datalist > .itemsDataList.table'));        
tableAllFields.map((field)=>{

    field.addEventListener('dragstart', (event) => {               

        event.dataTransfer.setData('text/html', event.target.nextElementSibling);
       
        currentTable = field.parentElement.attributes.rel.value
        elementDraged = addAllFieldsTable(event)
        console.log("Dragging table: ",currentTable," - ",elementDraged);
    });
});

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

        if(elementDraged){
            event.target.appendChild(elementDraged);
        }
        qe.classList.remove('highlight'); 
    });
});

const copyToClipboard = document.querySelector('.copyToClipboard');

copyToClipboard.addEventListener("click",() => copyTextToClipboard());

function addInputAlias(e){
    alert(e.target.value)
    console.log(e.target.value)            
}


const sql = {
    tables:[],
    fields:[],
    filter:""
}

let query = {}
const fields=[];
const tables=[];

/**
 * Configure button to add all selected fields by checkbos to content
 */
const addfield = Array.from(document.querySelectorAll('.addField'));

addfield.map((add)=>{
    add.addEventListener('click',function(){
        //const fieldsSelected = Array.from(document.querySelectorAll(".itemsDataList > input[type='checkbox']:checked"));
        //console.log(fieldsSelected[0].parentElement);
        let table = add.parentElement.parentElement;
        //console.log("table: ",table);

        let tableName = table.attributes.rel.value;
        currentTable = tableName;
        //tables.push(tableName);
        //console.log("Table:", table.attributes.rel.value);

        const fieldsSelected = Array.from(table.querySelectorAll(".itemsDataList > input[type='checkbox']:checked"))
        console.log(fieldsSelected)
        /*const fieldsSelected = Array.from(table.childNodes).filter((item) =>{
            console.log("Class:"+item.className);
            return item.className !== "table" && item.firstChild.attributes["checked"] === true
        });*/

        let ff = []
        fieldsSelected.map((field)=>{
            fields.push(field.name);
            ff.push(field.name);
            tables.push(tableName);
            queryEditor[0].appendChild(addFieldElement(tableName+"."+field.name));
        })

        addOneFieldToArray(ff,tableName,false)

        sql.fields = fields;
        sql.table = [...new Set(tables)];
        console.log(sql);
        
        let query = "select "+sql.fields.join(",");
        query+= " from "+sql.table.join(',')
        console.log(query)
    });

})

function addAllFieldsTable(e){
    console.log(e.target.parentNode)
    let newElement = document.createDocumentFragment()
    let table = e.target.parentNode.attributes.rel.value
    let flds = Array.from(e.target.parentNode.querySelectorAll(".itemsDataList:not(.table)"))

    let ff = []

    flds.map((field)=>{
        newElement.appendChild(addFieldElement(field.innerText))
        ff.push(field.innerText)
        addOneFieldToArray(field.innerText,table,false)          
    })
    

    return newElement
}

function addOneFieldToArray(field,table,single){
    if(Object.keys(query).includes(table)  && !single){
       table += "1"
    }
    if(!Object.keys(query).includes(table)) {
        query[table] = []
    }
    
    query[table].push(field)
    addTableToArray(table)
    console.log("Add filed to array:",table, field)
}

function addTableToArray(table){
    if(!sql.fields.includes(table))
        sql.tables.push(table)

    console.log("Add filed to array:", sql.tables)

}

function addFieldElement(text){
    let root = document.createElement("div");
    root.classList.add("selectFields","cel-13");
    //root.setAttribute("draggable",true)

    let label =  document.createElement("label");
    label.innerText = text;
    root.insertAdjacentElement("beforeend",label)

    let div =  document.createElement("div");
    div.classList.add("cel-8","flex-center");


    let input = document.createElement("input");
    input.setAttribute("name",currentTable+"_"+text)
    input.addEventListener("change",(e) =>{
        [table, name] = e.target.name.split(/_(.*)/s)
        
        let pos = query[table].indexOf(name)
        
        query[table][pos] = name+" as "+e.target.value;
        //console.log("Pos: ",pos,"  ",query[table])
    });

    root.insertAdjacentElement("beforeend",input)

    let select = document.createElement("select");
    select.setAttribute("name",currentTable+"_"+text);
    select.addEventListener("change",(e) => {
        [table, name] = e.target.name.split(/_(.*)/s)
        
        let pos = query[table].indexOf(name)
        
        query[table][pos] = name+" as "+e.target.value;
    })
    
    let option = document.createElement("option");
    option.setAttribute("value","");
    option.innerText = "Selecione..."
    select.insertAdjacentElement("beforeend",option)
    
    let option2 = option.cloneNode(true);
    option2.setAttribute("value","max");
    option2.innerText = "Máximo"
    select.insertAdjacentElement("beforeend",option2)

    root.insertAdjacentElement("beforeend",select)

    let actionRemove = document.createElement("i")
    actionRemove.classList.add("material-symbols-outlined")
    actionRemove.innerText = "close_small"
    root.insertAdjacentElement("beforeend",actionRemove)

  
    return root;
}

function addFilterdElement(text){
    let filterElement = document.createElement("div");
    filterElement.add("row","selectFields","cel-13");
    filterElement.innerHTML = 
    `<label class="cel-4">${text}</label>
                        <div class="cel-4">
                            <select name="comparador" id="">
                                <option value="">Selecione...</option>
                                <option value="=">Igual</option>
                                <option value="&lt;&gt;">Diferente</option>
                                <option value="&gt;">Maior que</option>
                                <option value="&gt;=">Maior ou Igual</option>
                                <option value="&lt;">Menor que</option>
                                <option value="&lt;=">Menor ou Igual</option>
                                <option value="like %{}">Começa com</option>
                                <option value="like {}%">Termina com</option>
                                <option value="like%{}%">Contém</option>
                            </select>
                        </div>
                        <div class="cel-6flex-center">
                            <input class="valor" name=" valor">
                        </div>
                        <div class="cel-4">
                            <select name="operador" id="">
                                <option value="">Selecione...</option>
                                <option value="and ">E</option>
                                <option value="or ">ou</option>
                            </select>
                        </div>
                        <div class="cel-2 actions">
                            <span class="material-symbols-outlined">close_small</span>
                        </div>
                    </div>`;
}

function createTableTree(){
    const tableArray = Object.keys(allTables);
    console.log("Read json table: ", allTables);
    const pallete = document.querySelector(".pallete");
    
    tableArray.map((tb) => {
        let list = document.createElement("ul");
        list.classList.add("datalist");
        list.setAttribute('rel',tb);
        
        let table = document.createElement("li")
        table.classList.add("itemsDataList","table");
        table.innerText= tb;
        table['draggable'] = true;
        
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
        console.log(Object.keys(allTables[tb]));
    })

}

/*
    Build query from Object
*/

function createQUERY(){
    let k = Object.keys(query)
    let fieldsSelected = []
    let doubleFields = []
    let q = "select "
    let field = ""

    k.map((key,pos) =>{
        console.log(query[key])
        query[key].map((field) =>{
            if(fieldsSelected.includes(field)) {
                doubleFields.push(field)
            }
            fieldsSelected.push(field)
        })

    })

    let allFields = []
    k.map((key,pos) =>{
        query[key].map((field) =>{
            if(doubleFields.includes(field)) {
                 field = key+"."+field
            }
            allFields.push(field)
        })

    })

    console.log("Double Fields: ",allFields)
    q += allFields.join(",")  
    q += " from "+k.join(',')

    console.log(query)
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

const navlinks = Array.from(document.querySelectorAll('.nav_link'))
navlinks.map((navlink)=>{
    navlink.addEventListener("click",(e) => tab(e))
})

function tab(e){            
    let target = e.target.attributes.target.value;
    navlinks.forEach(element => {
        element.className = "nav_link"
        let idContent = element.attributes.target.value
        document.getElementById(idContent).classList.remove("show")
        
    });
    
    const content = document.getElementById(target);            
    e.target.classList.toggle('active')
    content.classList.toggle('show')
}

async function copyTextToClipboard() {
    try {
        const text = document.querySelector(".scriptOutput");
        await navigator.clipboard.writeText(text.innerHTML);
        console.log(navigator.clipboard);
        console.log('Text copied to clipboard successfully!');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

