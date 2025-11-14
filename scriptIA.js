document.addEventListener('DOMContentLoaded', () => {
    const availableFields = document.getElementById('available-fields');
    const selectedFields = document.getElementById('selected-fields');
    const filtersContainer = document.getElementById('filters-container');
    const addFilterBtn = document.getElementById('add-filter-btn');
    const sqlOutput = document.getElementById('sql-output');
    
    // --- Data Model ---
    // Extract available fields from HTML (used for populating filter dropdowns)
    const allFields = Array.from(availableFields.querySelectorAll('.field-item')).map(item => ({
        name: item.dataset.field,
        type: item.dataset.type
    }));

    let selectedColumns = []; // ['id', 'name', ...]

    // --- Drag and Drop Logic for SELECT Clause ---
    let draggedItem = null;

    availableFields.querySelectorAll('.field-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = e.target;
            e.dataTransfer.setData('text/plain', e.target.dataset.field);
            e.target.classList.add('dragging');
        });
        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    selectedFields.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        selectedFields.classList.add('drag-over');
    });

    selectedFields.addEventListener('dragleave', () => {
        selectedFields.classList.remove('drag-over');
    });

    selectedFields.addEventListener('drop', (e) => {
        e.preventDefault();
        selectedFields.classList.remove('drag-over');

        const fieldName = e.dataTransfer.getData('text/plain');
        
        // Prevent duplicate selection
        if (!selectedColumns.includes(fieldName)) {
            // Clone the original item to move it logically to the selected list
            const clonedItem = draggedItem.cloneNode(true);
            clonedItem.draggable = false; // Disable dragging once selected
            clonedItem.style.cursor = 'default';
            
            // Add a removal button to the selected item
            const removeBtn = document.createElement('span');
            removeBtn.innerHTML = ' &times;';
            removeBtn.style.cssText = 'color: #ffc107; margin-left: 10px; cursor: pointer; font-weight: bold;';
            clonedItem.appendChild(removeBtn);
            
            removeBtn.addEventListener('click', () => {
                clonedItem.remove();
                selectedColumns = selectedColumns.filter(col => col !== fieldName);
                updateQuery();
            });

            // Remove placeholder if present
            const placeholder = selectedFields.querySelector('.placeholder');
            if (placeholder) {
                placeholder.remove();
            }

            selectedFields.appendChild(clonedItem);
            selectedColumns.push(fieldName);
            updateQuery();
        }
    });

    // --- Filter Builder Logic for WHERE Clause ---

    const operators = {
        'STRING': ['=', '!=', 'LIKE', 'NOT LIKE'],
        'INT': ['=', '!=', '>', '<', '>=', '<='],
        'FLOAT': ['=', '!=', '>', '<', '>=', '<='],
    };

    // --- Query Builder Logic for WHERE Clause ---

// ... (operators definition)

function createFilterRow() {
    const row = document.createElement('div');
    row.className = 'filter-row';

    // 1. Field Dropdown
    const fieldSelect = document.createElement('select');
    allFields.forEach(field => {
        const option = document.createElement('option');
        option.value = field.name;
        option.textContent = field.name;
        option.dataset.type = field.type;
        fieldSelect.appendChild(option);
    });
    row.appendChild(fieldSelect);

    // 2. Operator Dropdown
    const operatorSelect = document.createElement('select');
    
    // Function to update operators based on selected field type (omitted for brevity)
    const updateOperators = (selectedFieldType) => {
        operatorSelect.innerHTML = '';
        const availableOps = operators[selectedFieldType] || operators['STRING'];
        availableOps.forEach(op => {
            const option = document.createElement('option');
            option.value = op;
            option.textContent = op;
            operatorSelect.appendChild(option);
        });
    };

    // Initial update
    const initialFieldType = fieldSelect.options[fieldSelect.selectedIndex].dataset.type;
    updateOperators(initialFieldType);

    // **FIX 1: Call updateQuery() when the field changes**
    fieldSelect.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        updateOperators(selectedOption.dataset.type);
        updateQuery(); // <-- FIX
    });
    
    // **FIX 2: Call updateQuery() when the operator changes**
    operatorSelect.addEventListener('change', updateQuery);
    row.appendChild(operatorSelect);

    // 3. Value Input
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'Enter value';
    
    // **FIX 3: Call updateQuery() when the value changes**
    valueInput.addEventListener('input', updateQuery); 
    row.appendChild(valueInput);

    // 4. Remove Button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-filter';
    removeBtn.addEventListener('click', () => {
        row.remove();
        updateQuery();
    });
    row.appendChild(removeBtn);

    filtersContainer.appendChild(row);
    updateQuery();
}

    addFilterBtn.addEventListener('click', createFilterRow);
    
    // Create an initial empty filter
    createFilterRow();


    // --- Query Generation ---

    function updateQuery() {
        // --- 1. SELECT Clause ---
        const selectClause = selectedColumns.length > 0
            ? selectedColumns.join(', ')
            : '*';
            
        // --- 2. FROM Clause (Hardcoded for this example) ---
        const fromClause = 'products'; 
        
        // --- 3. WHERE Clause ---
        let whereConditions = [];
        
        filtersContainer.querySelectorAll('.filter-row').forEach(row => {
            const field = row.querySelector('select:nth-child(1)').value;
            const operator = row.querySelector('select:nth-child(2)').value;
            let value = row.querySelector('input').value.trim();

            if (field && operator && value) {
                // Determine if value needs quotes (simple type checking)
                const isString = fieldSelect.options[fieldSelect.selectedIndex].dataset.type === 'STRING';
                
                if (operator.includes('LIKE')) {
                    value = `'%${value}%'`; // Add wildcards and quotes for LIKE
                } else if (isString) {
                    value = `'${value}'`; // Add quotes for string literals
                }
                
                whereConditions.push(`${field} ${operator} ${value}`);
            }
        });
        
        const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(' AND ')}`
            : 'WHERE 1=1'; // Always true if no real conditions

        // --- 4. Final Query ---
        const finalQuery = `SELECT ${selectClause} FROM ${fromClause} ${whereClause};`;
        sqlOutput.textContent = finalQuery;
    }

    // Initialize the query output
    updateQuery();
});