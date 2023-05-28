import { FilterQuery, UpdateQuery } from "mongoose";
import detailSaleModel, { detailSaleDocument } from "../model/detailSale.model";
import { calcFuelBalance } from "./fuelBalance.service";

export const getDetailSale = async (query: FilterQuery<detailSaleDocument>) => {
  try {
    return await detailSaleModel
      .find(query)
      .lean()
      .populate("stationDetailId")
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const addDetailSale = async (body: detailSaleDocument) => {
  try {
   return await new detailSaleModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const updateDetailSale = async (
  query: FilterQuery<detailSaleDocument>,
  body: UpdateQuery<detailSaleDocument>
) => {
  try {
    await detailSaleModel.updateMany(query, body);
    return await detailSaleModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteDetailSale = async (
  query: FilterQuery<detailSaleDocument>
) => {
  try {
    let DetailSale = await detailSaleModel.find(query);
    if (!DetailSale) {
      throw new Error("No DetailSale with that id");
    }
    return await detailSaleModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const getDetailSaleByFuelType = async (
  dateOfDay: string,
  fuelType: string
) => {
  let fuel = await getDetailSale({
    dailyReportDate: dateOfDay,
    fuelType: fuelType,
  });

  let fuelLength = 0;
  if (fuel.length != 0) {
    fuelLength = fuel.length + 1;
  }
  let fuelLiter = fuel
    .map((ea) => ea["saleLiter"])
    .reduce((pv: number, cv: number): number => pv + cv, 0);
  let fuelAmount = fuel
    .map((ea) => ea["totalPrice"])
    .reduce((pv: number, cv: number): number => pv + cv, 0);
  return { count: fuelLength, liter: fuelLiter, price: fuelAmount };
};


// export const getDetailSaleByDate = async (query: FilterQuery<detailSaleDocument>) => {
//   try {
//     let sDate = new Date(query.startDate)
//     let eDate = new Date(query.endDate)

//     let gg = {
//       dailyReportDate: {
//         $gte: ISODate(sDate),
//         $lte: ISODate(eDate),
//       },
//     };

//     return await detailSaleModel
//       .find(gg)
//       .lean()
//       .populate("stationDetailId")
//       .select("-__v");
//   } catch (e) {
//     throw new Error(e);
//   }
// };