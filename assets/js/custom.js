document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector(".php-email-form");
    const resultsBox = document.getElementById("form-results");
    const popup = document.getElementById("popup-message");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // sustabdo persikrovimą

        // Surenkame duomenis
        const formData = {
            vardas: form.name.value,
            pavarde: form.surname.value,
            elPastas: form.email.value,
            telefonas: form.phone.value,
            adresas: form.address.value,
            klausimas1: Number(form.rating1.value),
            klausimas2: Number(form.rating2.value),
            klausimas3: Number(form.rating3.value)
        };

        // Vidurkio skaičiavimas
        const vidurkis = (
            (formData.klausimas1 +
            formData.klausimas2 +
            formData.klausimas3) / 3
        ).toFixed(1);

        // Išvedame objektą į konsolę
        console.log("Formos duomenys:", formData);

        // Atvaizduojame rezultatus apačioje
        resultsBox.innerHTML = `
            <h4>Gauti duomenys:</h4>
            <p><strong>Vardas:</strong> ${formData.vardas}</p>
            <p><strong>Pavardė:</strong> ${formData.pavarde}</p>
            <p><strong>El. paštas:</strong> ${formData.elPastas}</p>
            <p><strong>Telefono numeris:</strong> ${formData.telefonas}</p>
            <p><strong>Adresas:</strong> ${formData.adresas}</p>
            <p><strong>Ar megstat valgyt:</strong> ${formData.klausimas1}</p>
            <p><strong>Ar megstat vazynet:</strong> ${formData.klausimas2}</p>
            <p><strong>Ar megstat sokinet:</strong> ${formData.klausimas3}</p>
            <h4>${formData.vardas} ${formData.pavarde}: ${vidurkis}</h4>
        `;

        // Parodome pop-up pranešimą
        showPopup();
    });

    // Pop-up funkcija
    function showPopup() {
        popup.classList.add("show");

        // Slepiamas po 2,5 sekundžių
        setTimeout(() => {
            popup.classList.remove("show");
        }, 2500);
    }
});
