function drawDiagram(matrix_table, winningCards) {

    if (!matrix_table) {

        throw new Error("Matrix tablosu gönderilmedi.")
    }

    if (!winningCards) {

        throw new Error("Kazanılan kartlar bilgisi gönderilmedi.")
    }

    const total_rows = matrix_table.length;
    const total_cols = matrix_table[0].length;

    console.log("TABLE X AND", total_rows, total_cols)

    const diagram = Array.from({ length: total_cols }, () => Array(total_rows).fill('*')).slice(0, -2);



    console.log("table",matrix_table)

    if (winningCards) {

        
        for (const card of winningCards) {
            const { x, y } = card.position;
            diagram[x][y] = 'x';
        }
    }

    return diagram.map(table => table.join(' ')).join('\n');
}



module.exports = drawDiagram