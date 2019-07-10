var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

function initincidentes(db){
    var incidentesColl = db.collection('incidentes');
    router.get('/', (req, res, next)=>{
        incidentesColl.find().toArray((err, incidentes)=>{
            if(err){
                console.log(err);
                return res.status(404).json({"error":"Error al extraer incidentes de la base de datos"});
            }
            return res.status(200).json(incidentes);
        })
    })
};

router.get('/:id', (req, res, next)=>{
    var id = new ObjectID(req.params.id);
    incidentesColl.findOne({"_id": id} , (err, doc)=>{
      if(err){
        console.log(err);
        return res.status(404).json({"error":"No se Puede Obtener incidente Intente de Nuevo"});
      }
      return res.status(200).json(doc);
    });//findOne
 });
 
 router.post('/', (req, res, next)=>{
    var newincidentes = Object.assign(
      {},
      {
        "descripcion":"",
        "fechaYhora": new Date().getTime(),
        "tipo":"",
        "estado":"",
        "usuarioregistra":"",
        "usuarioasignado":"",
        "fechahoraasignado": new Date().getTime(),
        "fechahoracerrado": new Date().getTime()

      },
      req.body
    );
    incidentesColl.insertOne(newincidentes, (err, rslt)=>{
      if(err){
        console.log(err);
        return res.status(404).json({"error":"No se pudo agregar nuevo incidentes"});
      }
      if(rslt.ops.length===0){
        console.log(rslt);
        return res.status(404).json({ "error": "No se pudo agregar nuevo incidentes" });
      }
      return res.status(200).json(rslt.ops[0]);
    });
  });

  router.put('/:id', (req, res, next)=>{
    var query = {"_id":new ObjectID(req.params.id)};
    var update = {"$inc":{"views":1, "likes":1}};

    incidentesColl.updateOne(query, update, (err, rslt)=>{
      if (err) {
        console.log(err);
        return res.status(404).json({ "error": "No se pudo modificar incidente" });
      }
      
      return res.status(200).json(rslt);
    })
  }); // put

  router.delete('/:id', (req, res, next) => {
    var query = { "_id": new ObjectID(req.params.id) };
    incidentesColl.removeOne(query, (err, rslt) => {
      if (err) {
        console.log(err);
        return res.status(404).json({ "error": "No se pudo eliminar incidente" });
      }

      return res.status(200).json(rslt);
    })
  }); // delete

  return router;
}

module.exports = initincidentes;
