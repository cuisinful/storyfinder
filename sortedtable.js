class SortedTable {
    // colInfo is { col: {header: str, width: percentage} } with col keys from colOrder
    constructor(parentElem, dataList, colOrder = [], colInfo = {}) {
        if (dataList.length == 0) { throw new Error("Empty data list for SortedTable."); }
        
        this.parentElem = parentElem;
        this.dataList = dataList;
        var cols = Object.keys(dataList[0]);
        this.colOrder = colOrder.length == 0 ? cols : colOrder;
        this.colPercentagesDict = colInfo.length == 0 ?  // check Array.isArray(A)? 
                                    new Array(cols.length).fill(100/cols.length) :
                                    colInfo; // redo this line for colInfo instead of colPercentages
        this.tableElem = {};
        this.tableDataElem = {};
    }

    // allow resetting new data
    setData(newData) {
        this.dataList = newData;
        this.sortTable(); // includes draw
    }

    sortTable(col, direction = "asc") {
        direction = direction == "asc" ? 1 : -1;
        
        const sortFun = (a,b) => {
            if (a[col] < b[col]) { return direction * -1; }
            if (a[col] > b[col]) { return direction * 1; }
            return 0;       
        };

        const sortFunNum = (a,b) => {
            return direction * (b[col]-a[col]);
        }

        // TODO provide this as part of input spec
        const numericColumns = ["ranking", "stars", "views"];
        this.dataList.sort(numericColumns.includes(col) ? sortFunNum : sortFun);

        /*
        const sortedData =
            direction == "asc"
            ? [...data].sort(function (a, b) {
                if (a[param] < b[col]) {
                    return -1;
                }
                if (a[param] > b[col]) {
                    return 1;
                }
                return 0;
                })
            : [...data].sort(function (a, b) {
                if (b[param] < a[col]) {
                    return -1;
                }
                if (b[param] > a[col]) {
                    return 1;
                }
                return 0;
                });
        */
        this.drawData();
    };


    drawTable() {
        const resetButtons = (event) => {
            [...document.querySelectorAll("th button")].map((button) => {
                if (button !== event.target) {
                    button.removeAttribute("data-dir");
                }
            });
        };

        // create the table header in the object's tableElem
        const createHeader = () => {
            var tableHeader = this.tableElem.append("thead").append("tr");

            // column headers, one per key
            var objPtr = this;
            for (const col of this.colOrder) {
                tableHeader.insert("th").insert("button")
                                        .attr("id", col)
                                        .on("click", function() {
                                            const e = d3.event;
                                            resetButtons(e);
                                            const currDirection = e.target.getAttribute("data-dir") || "asc";
                                            objPtr.sortTable(e.target.id, currDirection);
                                            e.target.setAttribute("data-dir", currDirection == "asc" ? "desc" : "asc");
                                        } )
                                        .html(col);
            }
        };

        // clear contents of container, then add new table table element
        this.parentElem.selectAll("*").remove();
        this.tableElem = this.parentElem.insert("table").attr("id", "data-table")
        createHeader();

        this.tableDataElem = this.tableElem.append("tbody");
        this.drawData();
        
    }

    drawData() {
        var tbody = this.tableDataElem;
        tbody.selectAll("*").remove();
        for (var row of this.dataList) {
            var tr = tbody.append("tr");
            for (const col of this.colOrder) {
                if (col == "title") {
                    tr.append("td").append("a").attr("href", row.url).html(row[col]); // TODO elegance
                }
                else {
                    tr.append("td").html(row[col]);
                }
            }
        }
    }
}






