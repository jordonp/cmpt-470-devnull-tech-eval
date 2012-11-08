class TechEvalDemoController < ApplicationController
  def index
    if !signed_in?
        render :layout => "application_login"
    end
  end
end
