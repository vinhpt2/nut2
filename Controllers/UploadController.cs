using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace WebApplication2.Controllers
{
    public class UploadController : ApiController
    {
        public async Task<HttpResponseMessage> PostFormData()
        {
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            string root = HttpContext.Current.Server.MapPath("~/upload");
            var provider = new MultipartFormDataStreamProvider(root);

            try
            {
                // Read the form data.
                await Request.Content.ReadAsMultipartAsync(provider);

                // This illustrates how to get the file names.
                var count = provider.FileData.Count;
                var fileNames = new string[count];
                for (int i = 0; i < count; i++)
                {
                    var fileName = provider.FileData[i].LocalFileName;
                    fileNames[i] = fileName.Substring(fileName.LastIndexOf('\\')+1);
                }
                return Request.CreateResponse(HttpStatusCode.OK, fileNames);
            }
            catch (System.Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
        }
    }
}