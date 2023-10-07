function main(args) {
    var message = 'blank'
    if (args && args.http && args.http.queryString) {
      let params = new URLSearchParams(args.http.queryString);
       message = params.get("keyword") || "empty"
    }
    console.log(message)
    return {"body": "Amrutha says " + message}
  }