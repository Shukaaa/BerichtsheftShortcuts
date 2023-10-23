// ==UserScript==
// @name         Berichtsheft Shortcuts
// @namespace    Shukaaa
// @version      1.0
// @description  Entfernt Wochenende und bietet Shortcuts
// @author       You
// @match        https://bildung.ihk.de/webcomponent/dibe/AUSZUBILDENDER/berichtsheft/wochenansicht*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ihk.de
// @grant        none
// ==/UserScript==

let berichtsheftTagesbasis;

window.addEventListener("DOMContentLoaded", () => {
    let nav;
    let navContainer;
    let navInterval;

    const clearIntervalWhenElementsFound = () => {
        if (nav !== null && navContainer !== null && berichtsheftTagesbasis !== null) {
            clearInterval(navInterval)
            createShortcutButtons(navContainer, nav)
            deleteWochendEintraege()
        }
    }

    navInterval = setInterval(() => {
        nav = document.querySelector("lib-spb-berichtsheft-woche-navigation")
        navContainer = document.querySelector("div.berichtsheft-woche-header")
        berichtsheftTagesbasis = document.querySelector("lib-spb-berichtsheft-tagesbasis")
        clearIntervalWhenElementsFound(this)
    }, 500)
})

const deleteWochendEintraege = () => {
    document.querySelectorAll("mat-card.bericht-wochenende").forEach((wochenende) => {
        wochenende.remove()
    })
}

const createShortcutButtons = (elementContainer, elementToPlaceBefore) => {
    const triggerSelect = (matFormField) => {
        const div2 = matFormField.children[0]
        const div3 = div2.children[0]
        const div4 = div3.children[0]
        const matSelect = div4.children[0]
        const matSelectTrigger = matSelect.children[0]

        matSelectTrigger.click()
    }

    const selectPopUps = (valueToClick) => {
        const selectPopUps = document.querySelectorAll("div.mat-select-panel")
        selectPopUps.forEach((selectPopUp) => {
            for (const child of selectPopUp.children) {
                if (child.innerText === valueToClick) {
                    child.click()
                }
            }
        })
    }

    const selectMenuPopUp = (valueToClick) => {
        const menuPopUps = document.querySelectorAll("div.mat-menu-content")
        menuPopUps.forEach((menuPopUp) => {
            for (const child of menuPopUp.children) {
                if (child.innerText.includes(valueToClick)) {
                    child.click()
                }
            }
        })
    }

    const shortcutAnwesend = (location) => {
        const delay = 500

        berichtsheftTagesbasis.children.forEach((child, i) => {
            setTimeout(async () => {
                const fieldset = child.children[0]
                const matCard = fieldset.children[0]
                const matCardTitle = matCard.children[0]
                const div = matCardTitle.children[1]

                // Anwesenheitsfeld auf anwesend schalten
                const matFormField = div.children[0]
                triggerSelect(matFormField)
                selectPopUps("anwesend")

                await new Promise(r => setTimeout(r, delay / 4));

                // Ort anpassen
                const matFormField2 = div.children[1]
                triggerSelect(matFormField2)
                selectPopUps(location)

                await new Promise(r => setTimeout(r, delay / 4));

                // Freitext Eintrag hinzufügen
                const matCardContent = matCard.children[1]
                const div2 = matCardContent.children[0]
                const fieldset2 = div2.children[0]
                const div3 = fieldset2.children[1]
                const button = div3.children[0]

                button.click()
                selectMenuPopUp("Freitext")

                await new Promise(r => setTimeout(r, delay / 4));

                // Stunden auf 8 setzen
                const newFieldset = child.children[0]
                const matCard2 = newFieldset.children[0]
                const matCardContent2 = matCard2.children[1]
                const div4 = matCardContent2.children[0]
                const fieldset3 = div4.querySelector("fieldset")
                const div5 = fieldset3.querySelector("div")
                const div6 = div5.children[1]
                const div7 = div6.querySelector("div")
                const libSpbTimepicker = div7.querySelector("lib-spb-timepicker")
                const ngxTimepickerField = libSpbTimepicker.querySelector("ngx-timepicker-field")
                const div8 = ngxTimepickerField.querySelector("div")
                const ngxTimepickerTimeControl = div8.querySelector("ngx-timepicker-time-control")
                const div9 = ngxTimepickerTimeControl.querySelector("div")
                const div10 = div9.querySelector("div")
                const spanCountUp = div10.querySelector("span")

                for (let i = 0; i < 8; i++) {
                    spanCountUp.click()
                }
            }, i * delay)
        })
    }

    const shortcutAnwesenheiten = (anwesenheit) => {
        const delay = 200
        anwesenheit = anwesenheit === "Krank" ? "sonstige Abwesenheit" : anwesenheit

        berichtsheftTagesbasis.children.forEach((child, i) => {
            setTimeout(async () => {
                const fieldset = child.children[0]
                const matCard = fieldset.children[0]
                const matCardTitle = matCard.children[0]
                const div = matCardTitle.children[1]

                // Anwesenheitsfeld auf der übergebenen Anwesenheit schalten
                const matFormField = div.children[0]
                triggerSelect(matFormField)
                selectPopUps(anwesenheit)

                if (anwesenheit === "sonstige Abwesenheit") {
                    await new Promise(r => setTimeout(r, delay / 3));

                    const matCardContent = matCard.children[1]
                    const div2 = matCardContent.querySelector("div")
                    const div3 = div2.querySelector("div")
                    const matFormField = div3.querySelector("mat-form-field")
                    const div4 = matFormField.querySelector("div")
                    const div5 = div4.querySelector("div")
                    const div6 = div5.querySelector("div")
                    const libSpbPlaintext = div6.querySelector("lib-spb-plaintext")
                    const textarea = libSpbPlaintext.querySelector("textarea")

                    libSpbPlaintext.click()

                    await new Promise(r => setTimeout(r, delay / 3));

                    // simulates typing
                    textarea.value = "Krank"
                    textarea.dispatchEvent(new Event('input', { bubbles: true }))
                }
            }, delay * i)
        })
    }

    const shortcutEintreageLeeren = (x) => {
        berichtsheftTagesbasis.children.forEach((child, i) => {
            setTimeout(async () => {
                const fieldset = child.children[0]
                const matCard = fieldset.children[0]
                const matCardActions = matCard.children[2]
                const button = matCardActions.children[0]

                button.click()
            }, i * 100)
        })

        setTimeout(() => {
            let errorSnackbar = document.querySelector("div.mat-simple-snackbar-action")
            errorSnackbar.children[0].click()
        }, 1500)
    }

    const createButton = (name, onclickFunction) => {
        let button = document.createElement("button")
        button.innerText = name
        button.classList.add("mat-raised-button", "mat-button-base")
        button.addEventListener("click", () => {
            onclickFunction(name)
        })

        return button
    }

    let buttonDiv = document.createElement("div")
    buttonDiv.style.display = "flex"
    buttonDiv.style.justifyContent = "space-between"
    buttonDiv.style.gap = "5px"

    let buttonBetrieb = createButton("Betrieb", shortcutAnwesend)
    let buttonSchule = createButton("Schule", shortcutAnwesend)
    let buttonUrlaub = createButton("Urlaub", shortcutAnwesenheiten)
    let buttonKrank = createButton("Krank", shortcutAnwesenheiten)
    let buttonEintraegeLeeren = createButton("Einträge Leeren", shortcutEintreageLeeren)

    buttonDiv.append(buttonSchule, buttonBetrieb, buttonUrlaub, buttonKrank, buttonEintraegeLeeren)
    elementContainer.insertBefore(buttonDiv, elementToPlaceBefore)
}