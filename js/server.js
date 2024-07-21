fetch('/api/materials')
    .then(response => response.json())
    .then(materials => {
        const select = document.getElementById('materialSelect');
        materials.forEach(material => {
            const option = document.createElement('option');
            option.value = material.id;
            option.textContent = `${material.name} (${material.costPerM2} per m2)`;
            select.appendChild(option);
        });
    });
