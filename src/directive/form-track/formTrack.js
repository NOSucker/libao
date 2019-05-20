export default {
  bind(el, binding, vnode) {
    vnode.componentInstance.trackValue = binding.value;
    vnode.componentInstance.$on("el.form.addField", field => {
      field.trackLabel = null;
      field.$on("el.form.change", newVal => {
        let oldVal = vnode.componentInstance.trackValue;
        if (oldVal) {
          field.prop.split(".").forEach(p => {
            if (oldVal) {
              oldVal = oldVal[p];
            }
          });

          if (typeof newVal === "object") {
            newVal = JSON.stringify(newVal);
          }
          if (typeof oldVal === "object") {
            oldVal = JSON.stringify(oldVal);
          }

          if (newVal !== oldVal && !(!newVal && !oldVal)) {
            if (field.$slots.default.length > 0 && field.$slots.default[0].componentInstance.$options._componentTag === "el-select") {
              oldVal = field.$slots.default[0].componentInstance.getOption(oldVal).label || oldVal;
              newVal = field.$slots.default[0].componentInstance.getOption(newVal).label || newVal;
            }
            if (!field.trackLabel) {
              field.trackLabel = document.createElement("div");
              field.trackLabel.className = "el-form-item__track el-form-item__error";
              if (!oldVal) {
                oldVal = "";
              }
              field.trackLabel.innerHTML = `原值：${oldVal}`;
              if (field.validateState === "error") {
                field.trackLabel.style = "display:none";
              }
              field.$el.querySelector(".el-form-item__content").appendChild(field.trackLabel);
              field.$el.classList.add("is-track");
            }
          } else if (field.trackLabel) {
            field.$el.querySelector(".el-form-item__content").removeChild(field.trackLabel);
            field.$el.classList.remove("is-track");
            field.trackLabel = null;
          }
          vnode.componentInstance.$emit("form-track", {
            prop: field.prop,
            label: field.label,
            oldValue: oldVal,
            newValue: newVal
          });
        }
      });

      field.$watch("validateState", valid => {
        if (field.trackLabel) {
          if (valid === "error") {
            field.trackLabel.style = "display:none";
            field.$el.classList.remove("is-track");
          } else {
            field.trackLabel.style = "";
            field.$el.classList.add("is-track");
          }
        }
      });
    });
  },
  update(el, binding, vnode) {
    vnode.componentInstance.trackValue = binding.value;
  }
};
