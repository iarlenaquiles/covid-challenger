const api = require("../../service/api");
const apiNuvem = require("../../service/apiNuvem");
const { differenceInDays, addDays, format } = require("date-fns");

const FormatDate = require("../utils/formatDate");

sort = cases => {
  cases.sort((city1, city2) => {
    return city1.confirmed_per_100k_inhabitants >
      city2.confirmed_per_100k_inhabitants
      ? -1
      : city1.confirmed_per_100k_inhabitants <
        city2.confirmed_per_100k_inhabitants
      ? 1
      : 0;
  });
};

removeDuplicated = cases => {
  var reduced = [];

  cases.forEach(item => {
    var duplicated =
      reduced.findIndex(redItem => {
        return item.city == redItem.city;
      }) > -1;

    if (!duplicated) {
      reduced.push(item);
    }
  });

  return reduced;
};

convert = (index, data) => {
  return {
    id: index,
    nomeCidade: data.city,
    percentualDeCasos: data.confirmed_per_100k_inhabitants
  };
};

class CovidController {
  async get(req, res) {
    try {
      const { dateStart, dateEnd, state } = req.query;

      const start = new Date(dateStart);
      const end = new Date(dateEnd);

      const daysBetween = differenceInDays(end, start);

      let cases = [];
      const startFormated = FormatDate(dateStart);

      let dateAdded = start;

      if (daysBetween === 1) {
        const response = await api.get(`?state=${state}&date=${startFormated}`);

        cases = response.data.results;
      } else {
        for (let i = 0; i <= daysBetween; i++) {
          let addDate = addDays(dateAdded, 1);
          dateAdded = addDate;

          let dateFormated = format(new Date(dateAdded), "yyyy-MM-dd");
          const response = await api.get(
            `?state=${state}&date=${dateFormated}`
          );
          cases.push(...response.data.results);
        }
      }

      sort(cases);

      const unique = removeDuplicated(cases);
      const sliced = unique.slice(0, 10);

      const sendResults = [];

      for (const i in sliced) {
        const dadosParsed = convert(i, sliced[i]);
        const response = await apiNuvem.post("testApi", dadosParsed, {
          headers: { MeuNome: "Iarlen Aquiles" }
        });
        sendResults.push(response.data);
      }

      return res.status(200).json({ cases: sendResults });
    } catch (err) {
      return res.status(502).json({ message: "Erro na requisição" });
    }
  }
}

module.exports = new CovidController();
