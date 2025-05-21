
const getDateFormat = async (date)  => {

    const [day, month, year] = date.split('-');

    const fullYear = year.length === 2 ? `20${year}` : year;

    return `${fullYear}-${month}-${day}`;
}

module.exports = getDateFormat;