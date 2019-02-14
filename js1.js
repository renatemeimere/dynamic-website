            const template = document.querySelector("#myTemp").content;
            const main = document.querySelector("main");
            const nav = document.querySelector("nav");
            const modal = document.querySelector(".modal-bg");
            modal.addEventListener("click", () => modal.classList.add("hide"));
            const productlistLink = "http://kea-alt-del.dk/t5/api/productlist";
            const catLink = "http://kea-alt-del.dk/t5/api/categories";

            const allLink = document.querySelector("#all");
            const productLink = "http://kea-alt-del.dk/t5/api/product?id=";
            const imgLink = "http://kea-alt-del.dk/t5/site/imgs/";

            allLink.addEventListener("click", () => showCategory("all"));

            fetch(catLink).then(e => e.json()).then(data => createCatSections(data));

            function createCatSections(categories) {
                categories.forEach(cat => {
                    const newSection = document.createElement("section");
                    const newHeader = document.createElement("h2");

                    const newA = document.createElement("a");
                    newA.textContent = cat;
                    newA.href = "#";
                    newA.addEventListener("click", () => showCategory(cat));
                    nav.appendChild(newA)

                    newSection.id = cat;
                    newHeader.textContent = cat;
                    main.appendChild(newHeader);
                    main.appendChild(newSection);
                })

                fetch(productlistLink).then(e => e.json()).then(data => data.forEach(showData));
            }

            function showCategory(category) {
                console.log(category)
                document.querySelectorAll("main section").forEach(section => {
                    if (section.id == category || category == "all") {
                        section.style.display = "grid";
                        section.previousElementSibling.style.display = "block";
                    } else {
                        section.style.display = "none";
                        section.previousElementSibling.style.display = "none";
                    }

                })
            }

            function showDetails(product) {
                modal.querySelector(".modal-name").textContent = product.name;
                modal.querySelector(".modal-image").src = "https://kea-alt-del.dk/t5/site/imgs/small/" + product.image + "-sm.jpg";
                modal.querySelector(".modal-description").textContent = product.longdescription;
              //  modal.querySelector(."price").textContent=product.price-(product.price*product.discount/100);

                let price = modal.querySelector(".modal-price");
                if (product.discount) {
                    let newPrice = Math.floor(product.price - (product.price * product.discount / 100));
                    price.textContent = "Now: " + newPrice + ",-";
                } else {
                    price.textContent = "Price: " + product.price + ",-";
                }
                modal.classList.remove("hide");


            }

            function showData(product) {
                const section = document.querySelector("#" + product.category)
                let clone = template.cloneNode(true);
                clone.querySelector(".product").textContent = product.name;
                clone.querySelector("button").addEventListener("click", () => {
                    fetch(productLink + product.id).then(e => e.json()).then(data => showDetails(data));
                })

                clone.querySelector("img").src = "https://kea-alt-del.dk/t5/site/imgs/small/" + product.image + "-sm.jpg";
                clone.querySelector("img").alt = product.image;
                clone.querySelector("ins").textContent = product.price;
                clone.querySelector("del").textContent = product.price;
                if (product.vegetarian == false) {
                    clone.querySelector(".vegetarian").remove()
                }
                if (product.alcohol == false) {
                    clone.querySelector(".alcohol").remove()
                }

                if (product.soldout) {
                    const article = clone.querySelector("article");
                    article.classList.add("soldout");
                    const message = document.createElement("p");
                    message.textContent = "sold out";
                    message.classList.add("overlay");
                    article.appendChild(message);
                }


                if (product.discount > 0) {
                    clone.querySelector("ins").textContent = "Now " + product.price * ((100 - product.discount) / 100) + ",-";
                } else {
                    clone.querySelector("del").remove()
                }


                section.appendChild(clone);

            }
