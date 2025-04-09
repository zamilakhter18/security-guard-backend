import mongoose from "mongoose";

export const userAggregations = {
  getAllGuardsOfACompany(userId: string) {
    return [
      {
        $lookup: {
          from: "companyguards",
          localField: "companyId",
          foreignField: "companyId",
          as: "guards",
        },
      },
      { $unwind: "$guards" },
      {
        $lookup: {
          from: "users",
          localField: "guards.userId",
          foreignField: "_id",
          as: "guardDetails",
        },
      },
      { $unwind: "$guardDetails" },

      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },

      {
        $addFields: {
          serviceId: {
            $arrayElemAt: ["$guardDetails.services", 0],
          },
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $project: {
          _id: "$guardDetails._id",
          firstName: "$guardDetails.firstName",
          lastName: "$guardDetails.lastName",
          email: "$guardDetails.email",
          serviceId: {
            $arrayElemAt: ["$guardDetails.services", 0],
          },
          dateOfBirth: "$guardDetails.dateOfBirth",
          companyId: "$companyId",
          serviceName: {
            $arrayElemAt: ["$result.name", 0],
          },
        },
      },
    ];
  },
};
