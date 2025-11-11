"use client";
import { LogBook } from "@/connection/interface";
import { SetCookieDocumentLogBook } from "@/function/cookie/logBook";
import { toDBTime } from "@/function/dateTime";
import { useRouter } from "next/navigation";
export default function LogBookHistory({ data }: { data: LogBook[] }) {
  const router = useRouter();

  const handleClick = (id_document: number) => {
    SetCookieDocumentLogBook(id_document);
    router.push("/Dashboard/Log_Book/Log_Book_Detail");
  };

  return (
    <div className="m-2">
      <div className="mb-3 font-bold text-2xl text-blue-500">
        DAFTAR LOGBOOK DI TIAP APPLIKASI KREDENSIAL
      </div>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-4">
          {data.map((detail, i) => (
            <div
              key={i}
              onClick={() => handleClick(detail.id_document)}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50"
            >
              {/* Card Content */}
              <div className="space-y-2">
                {/* Name */}
                <h3 className="flex justify-between items-center font-semibold text-lg rounded-2xl text-white px-4 truncate bg-blue-500">
                  {detail.short_name}
                </h3>
                {/* Jenis PK */}
                <div className="flex  flex-row items-center text-sm text-gray-600 font-semibold">
                  <span className="text-gray-800 basis-11/12">
                    {detail.pk_grade}
                  </span>
                </div>
                {/* Nama Lengkap */}
                <div className="flex items-center text-xs text-gray-600 max-w-full">
                  <span
                    className="text-gray-800 overflow-hidden text-ellipsis"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {detail.name_document}
                  </span>
                </div>
                {/* Last Update
                <div className="flex items-center text-sm justify-between  text-yellow-400">
                  <div>
                    <span className="font-medium mr-2  text-blue-400">
                      Diperbarui Pada:
                    </span>
                    <span className="font-medium truncate  text-blue-400">
                      {toDBTime(detail.create_date)}
                    </span>
                  </div>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          Anda belum dapat mengisi Logbook jika anda belum mengajukan Aplikasi
          Kredensial.
        </div>
      )}
    </div>
  );
}
